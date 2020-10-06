class AccessControlList {
  /**
   * Check weather the user have these roles.
   *
   * @user {object} user user.roles is an array of roles ids, e.g. [1,2]
   * @roles {array} roles array or roles names or ids if ids option is true,
   * e.g. ['admin', 'super'] or [1,2]
   * @ids {bool} if true then we pass array of roles ids
   */
  isUser (user, roles = [], ids = false, relationship = 'EVERY', allRoles) {
    if (!user) {
      return false
    }

    if (ids) {
      if (relationship === 'EVERY') {
        return roles.every(r => user.roles.includes(r))
      } else {
        return roles.some(r => user.roles.includes(r))
      }
    } else {
      const userRolesNames = this.rolesIDsToNames(user.roles, allRoles)

      if (relationship === 'EVERY') {
        return roles.every(r => userRolesNames.includes(r))
      } else {
        return roles.some(r => userRolesNames.includes(r))
      }
    }
  }

  /**
   * Check weather the user have these capabilities.
   *
   * @param {object} user user.roles is an array of capabilities ids, e.g. [1,2]
   * @param {array} capabilities array or roles names or ids if ids option is true,
   * e.g. ['manageAdmins', 'manageOthersPosts'] or [1,2]
   * @ids {bool} if true then we pass array of capabilities ids
   */
  isUserCan (
    user,
    capabilities = [],
    ids = false,
    relationship = 'EVERY',
    allRoles
  ) {
    if (!user) {
      return false
    }

    if (ids) {
      const userCapabilities = this.getUserCapabilities(user, true, allRoles)

      if (relationship === 'EVERY') {
        return capabilities.map(c => c).every(c => userCapabilities.includes(c))
      } else {
        return capabilities.map(c => c).some(c => userCapabilities.includes(c))
      }
    } else {
      const userCapabilities = this.getUserCapabilities(user, false, allRoles)

      if (relationship === 'EVERY') {
        return capabilities.every(c => userCapabilities.includes(c))
      } else {
        return capabilities.some(c => userCapabilities.includes(c))
      }
    }
  }

  /**
   * roles is array of ids
   * return array of capabilities objects
   */
  getRolesCapabilities (roles, allRoles) {
    // Make sure the roles is strings
    roles = roles.map(r => r)

    return allRoles
      .filter(r => roles.includes(r.id))
      .reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.capabilities
        ],
        []
      )
  }

  getBoolValue (field, user, obj, allRoles) {
    if (typeof field === 'boolean') {
      return field
    }

    var result

    switch (field.type) {
      default:
      case 'auth':
        return !!(user && user.id)

      case 'owner':
        // eslint-disable-next-line eqeqeq
        return !!(user && user.id && obj.createdBy == user.id)

      case 'haveAnyRoles':
        result = this.isUser(
          user,
          field.value,
          true,
          'SOME',
          allRoles
        )

        return result
      case 'haveAllRoles':
        result = this.isUser(
          user,
          field.value,
          true,
          'EVERY'
        )
        return result
      case 'haveAllCaps':
        result = this.isUserCan(
          user,
          field.value,
          true,
          'EVERY',
          allRoles
        )
        return result
      case 'haveAnyCap':
        result = this.isUserCan(
          user,
          field.value,
          true,
          'SOME',
          allRoles
        )
        return result
    }
  }

  getRowVal (fields, user, obj, allRoles) {
    let returnedDataRestriction
    const init = { usedIndexes: [], value: null }
    for (const [index, curr] of fields.entries()) {
      if (!init.usedIndexes.includes(index)) {
        if (typeof curr === 'boolean') {
          init.value = curr
          continue
        }

        if (curr.type === 'relation') {
          const nextItem = fields[index + 1]
          init.usedIndexes.push(index + 1)

          if (['allData', 'ownedData'].includes(nextItem.type)) {
            returnedDataRestriction = nextItem.type
          }

          let val
          if (curr.value === 'or') {
            val = init.value || this.getBoolValue(nextItem, user, obj, allRoles)
          } else {
            val = init.value && this.getBoolValue(nextItem, user, obj, allRoles)
          }
          init.value = val

          // return init
        } else {
          if (['allData', 'ownedData'].includes(curr.type)) {
            init.value = true
            returnedDataRestriction = curr.type
          } else {
            init.value = this.getBoolValue(curr, user, obj, allRoles)
          }
        }
      }
    }

    return { value: init.value, returnedDataRestriction }
  }

  conditionBuilder (_data, user, obj, allRoles) {
    let returnedDataRestriction = null
    // Should be something like [false, {type: 'relation', value: 'or'}, true]
    const newFields = []
    for (const field of _data.fields) {
      if (field.fields.length === 1 && field.fields[0].type === 'relation') {
        newFields.push(field.fields[0])
      } else {
        const rowVal = this.getRowVal(field.fields, user, obj, allRoles)
        returnedDataRestriction = rowVal.returnedDataRestriction && rowVal.value ? rowVal.returnedDataRestriction : returnedDataRestriction
        newFields.push(rowVal.value)
      }
    }

    const finalVal = this.getRowVal(newFields, user, obj, allRoles)
    // return { value: finalVal.value, returnedDataRestriction }
    return finalVal.value
  }

  canReadContent (user, schema, skipNoRestrictionsCheck = false, allRoles) {
    // if (!user) {
    //   return false
    // }
    if (!schema || !schema.acl || !schema.acl.read) {
      return true
    }

    const alcSettings = schema.acl.read

    // In case no restrictions at all
    if (
      !skipNoRestrictionsCheck &&
      !alcSettings.enable
    ) {
      return true
    }

    // If the user role is super or administrator then allow access
    // let adminSuperCheck = this.isUser(
    //   user,
    //   ['super', 'administrator'],
    //   false,
    //   'SOME',
    //   allRoles
    // )
    // if (adminSuperCheck) {
    //   return true
    // }

    const canRead = this.conditionBuilder(alcSettings, user, null, allRoles)

    if (canRead) {
      return true
    }

    return false
  }

  canDeleteContent (user, schema, skipNoRestrictionsCheck = false, allRoles, obj) {
    // if (!user) {
    //   return false
    // }

    if (!schema || !schema.acl || !schema.acl.delete) {
      return true
    }

    const alcSettings = schema.acl.delete

    // In case no restrictions at all
    if (
      !skipNoRestrictionsCheck &&
      !alcSettings.enable
    ) {
      return true
    }

    // If the user role is super or administrator then allow access
    // let adminSuperCheck = this.isUser(
    //   user,
    //   ['super', 'administrator'],
    //   false,
    //   'SOME',
    //   allRoles
    // )
    // if (adminSuperCheck) {
    //   return true
    // }

    const canDelete = this.conditionBuilder(alcSettings, user, obj, allRoles)

    if (canDelete) {
      return true
    }

    return false
  }

  canCreateContent (user, schema, skipNoRestrictionsCheck = false, allRoles) {
    // if (!user) {
    //   return false
    // }

    if (!schema || !schema.acl || !schema.acl.create) {
      return true
    }

    const alcSettings = schema.acl.create

    // In case no restrictions at all
    if (
      !skipNoRestrictionsCheck &&
      !alcSettings.enable
    ) {
      return true
    }

    // If the user role is super or administrator then allow access
    // let adminSuperCheck = this.isUser(
    //   user,
    //   ['super', 'administrator'],
    //   false,
    //   'SOME',
    //   allRoles
    // )
    // if (adminSuperCheck) {
    //   return true
    // }

    const canCreate = this.conditionBuilder(alcSettings, user, null, allRoles)

    if (canCreate) {
      return true
    }

    return false
  }

  canUpdateContent (user, schema, skipNoRestrictionsCheck = false, allRoles, obj) {
    // if (!user) {
    //   return false
    // }

    if (!schema || !schema.acl || !schema.acl.update) {
      return true
    }

    const alcSettings = schema.acl.update

    // In case no restrictions at all
    if (
      !skipNoRestrictionsCheck &&
      !alcSettings.enable
    ) {
      return true
    }

    // If the user role is super or administrator then allow access
    // let adminSuperCheck = this.isUser(
    //   user,
    //   ['super', 'administrator'],
    //   false,
    //   'SOME',
    //   allRoles
    // )
    // if (adminSuperCheck) {
    //   return true
    // }

    const canUpdate = this.conditionBuilder(alcSettings, user, obj, allRoles)

    if (canUpdate) {
      return true
    }

    return false
  }

  getUserCapabilities (user, ids = false, allRoles) {
    let rolesCapabilities = this.getRolesCapabilities(user.roles, allRoles)

    rolesCapabilities = rolesCapabilities.map(c => c.id)

    let allUserCapabilities = [...user.capabilities, ...rolesCapabilities]

    if (!ids) {
      allUserCapabilities = this.capabilitiesIDsToNames(
        allUserCapabilities,
        allRoles
      )
    }

    return allUserCapabilities
  }

  capabilitiesIDsToNames (capabilitiesIds, allRoles) {
    const allCapabilities = allRoles.reduce(
      (accumulator, currentValue) => [
        ...accumulator,
        ...currentValue.capabilities
      ],
      []
    )

    return allCapabilities
      .filter(c => capabilitiesIds.includes(c.id))
      .map(r => r.name)
  }

  rolesIDsToNames (rolesIds, allRoles) {
    const rolesNames = allRoles
      .filter(r => rolesIds.includes(r.id))
      .map(r => r.name)

    return rolesNames
  }
}

var ACL = new AccessControlList()

export default ACL
