import { validations } from 'validno'
import {ObjectId} from 'bson'

import isValidJSON from './utils/is-valid-json.js'
// Types
import type { TableField, TableFieldAny } from './kz-schema-factory/types.js'
import type TableFieldString from './kz-schema-factory/types-constructors/string.js'
import type TableFieldNumber from './kz-schema-factory/types-constructors/number.js'
import type TableFieldBoolean from './kz-schema-factory/types-constructors/boolean.js'
import type TableFieldDate from './kz-schema-factory/types-constructors/date.js'
import type TableFieldJson from './kz-schema-factory/types-constructors/json.js'
import type TableFieldEmail from './kz-schema-factory/types-constructors/email.js'
import type TableFieldUrl from './kz-schema-factory/types-constructors/url.js'
import type TableFieldSelect from './kz-schema-factory/types-constructors/select.js'
import TableFieldRelation from './kz-schema-factory/types-constructors/relation.js'

const defaultKeys = ['_id', 'createdAt', 'updatedAt']

interface ParseSchemaOptions {
  relationAsObjectId?: boolean
}

const getDefaultOptions = (): ParseSchemaOptions  => ({
  relationAsObjectId: true,
})

class KodzeroToValidnoParser {
  static parseString(field: TableField<TableFieldString>) {
    const output: { type: StringConstructor; rules?: Record<string, unknown> } = { type: String }

    const specs = {
      lengthMax: field.item.specs.lengthMax !== null,
      lengthMin: field.item.specs.lengthMin !== null,
      pattern: field.item.specs.pattern !== null,
      mayBeEmpty: field.item.specs.mayBeEmpty === false,
    }

    const hasSpecs = Object.values(specs).some((v) => v === true)

    if (hasSpecs) {
      output.rules = {}

      if (specs.lengthMax) {
        output.rules.lengthMax = field.item.specs.lengthMax
      }

      if (specs.lengthMin) {
        output.rules.lengthMin = field.item.specs.lengthMin
      }

      if (specs.pattern && typeof field.item.specs.pattern === 'string') {
        output.rules.regex = new RegExp(field.item.specs.pattern)
      }

      if (specs.mayBeEmpty) {
        output.rules.lengthNot = 0
      }
    }

    return output
  }

  static parseNumber(field: TableField<TableFieldNumber>) {
    const output: { type: NumberConstructor; rules?: Record<string, unknown> } = { type: Number }

    const specs = {
      min: field.item.specs.min !== null,
      max: field.item.specs.max !== null,
      mayBeEmpty: field.item.specs.mayBeEmpty === false,
    }

    const hasSpecs = Object.values(specs).some((v) => v === true)

    if (hasSpecs) {
      output.rules = {}

      if (specs.min) {
        output.rules.min = field.item.specs.min
      }

      if (specs.max) {
        output.rules.max = field.item.specs.max
      }

      if (specs.mayBeEmpty) {
        output.rules.isNot = 0
      }
    }

    return output
  }

  static parseBoolean(field: TableField<TableFieldBoolean>) {
    const output: { type: BooleanConstructor; rules?: Record<string, unknown> } = { type: Boolean }

    const specs = {
      onlyTrue: field.item.specs.onlyTrue === true,
    }

    const hasSpecs = Object.values(specs).some((v) => v === true)

    if (hasSpecs) {
      output.rules = {}

      if (specs.onlyTrue) {
        output.rules.is = true
      }
    }

    return output
  }

  static parseDate(field: TableField<TableFieldDate>) {
    const output: { type: DateConstructor; rules?: Record<string, unknown> } = { type: Date }

    const specs = {
      min: field.item.specs.min !== null,
      max: field.item.specs.max !== null,
      mayBeEmpty: field.item.specs.mayBeEmpty === false,
    }

    const hasSpecs = Object.values(specs).some((v) => v === true)

    if (hasSpecs) {
      output.rules = {}

      if (specs.mayBeEmpty) {
        output.rules.isNot = null
      }

      if (specs.min || specs.max) {
        output.rules.custom = (value: Date, {}) => {
          const checks = { min: true, max: true }

          const dateValue = new Date(value).getTime()

          if (specs.min) {
            const minDate = new Date(field.item.specs.min as Date).getTime()
            if (dateValue < minDate) {
              checks.min = false
            }
          }

          if (specs.max) {
            const maxDate = new Date(field.item.specs.max as Date).getTime()
            if (dateValue > maxDate) {
              checks.max = false
            }
          }

          const passed = Object.values(checks).every((v) => v === true)

          return {
            result: passed,
            details: passed ? '' : 'Date is out of allowed range',
          }
        }
      }
    }

    return output
  }

  static parseJson(field: TableField<TableFieldJson>) {
    const output: { type: StringConstructor; rules: Record<string, unknown> } = {
      type: String,
      rules: {},
    }

    const specs = {
      mayBeEmpty: field.item.specs.mayBeEmpty === false,
    }

    if (specs.mayBeEmpty) {
      output.rules.isNot = ''
    }

    output.rules.custom = (value: string, {}) => {
      return {
        result: isValidJSON(value),
        details: isValidJSON(value) ? '' : 'Invalid JSON format',
      }
    }

    return output
  }

  static parseEmail(field: TableField<TableFieldEmail>) {
    const output: { type: StringConstructor; rules?: Record<string, unknown> } = { type: String }
    const hasSpecs = {
      allowedDomains:
        Array.isArray(field.item.specs.allowedDomains) &&
        field.item.specs.allowedDomains.length > 0,
      exceptDomains:
        Array.isArray(field.item.specs.exceptDomains) && field.item.specs.exceptDomains.length > 0,
      mayBeEmpty: field.item.specs.mayBeEmpty === false,
    }

    output.rules = {}

    if (hasSpecs.mayBeEmpty) {
      output.rules.isNot = ''
    }

    if (hasSpecs.allowedDomains || hasSpecs.exceptDomains || !hasSpecs.mayBeEmpty) {
      output.rules.custom = (value: string, {}) => {
        if (field.item.specs.mayBeEmpty === true && value === '') {
          return {
            result: true,
            details: '',
          }
        }

        if (field.item.specs.mayBeEmpty && typeof value === 'string' && value.trim() === '') {
          return {
            result: true,
            details: '',
          }
        }

        const emailParts = value.split('@')
        const formatCheck = validations.isEmail(value)

        if (!formatCheck) {
          return {
            result: false,
            details: 'Invalid email format',
          }
        }

        const domain = emailParts[1].toLowerCase()
        let allowed = true

        if (hasSpecs.allowedDomains) {
          const allowedDomainsLower = field.item.specs.allowedDomains.map((d: string) =>
            d.toLowerCase(),
          )
          if (!allowedDomainsLower.includes(domain)) {
            allowed = false
          }
        }

        if (hasSpecs.exceptDomains) {
          const exceptDomainsLower = field.item.specs.exceptDomains.map((d: string) =>
            d.toLowerCase(),
          )
          if (exceptDomainsLower.includes(domain)) {
            allowed = false
          }
        }

        return {
          result: allowed,
          details: allowed ? '' : 'Email domain is not allowed',
        }
      }
    }

    return output
  }

  static parseUrl(field: TableField<TableFieldUrl>) {
    const output: { type: StringConstructor; rules?: Record<string, unknown> } = { type: String }

    const specs = {
      allowedDomains:
        Array.isArray(field.item.specs.allowedDomains) &&
        field.item.specs.allowedDomains.length > 0,
      exceptDomains:
        Array.isArray(field.item.specs.exceptDomains) && field.item.specs.exceptDomains.length > 0,
      mayBeEmpty: field.item.specs.mayBeEmpty === false,
    }

    const hasSpecs = Object.values(specs).some((v) => v === true)

    if (hasSpecs) {
      output.rules = {}

      if (specs.mayBeEmpty) {
        output.rules.isNot = ''
      }

      if (specs.allowedDomains || specs.exceptDomains) {
        output.rules.custom = (value: string, {}) => {
          if (field.item.specs.mayBeEmpty && typeof value === 'string' && value.trim() === '') {
            return {
              result: true,
              details: '',
            }
          }
          // Url pattern to extract domain (considering www and protocol)
          const urlPattern = /^(https?:\/\/)?(www\.)?([^\/]+)/i
          const match = value.match(urlPattern)
          if (!match || match.length < 3) {
            return {
              result: false,
              details: 'Invalid URL format',
            }
          }

          const domain = match[3].toLowerCase()

          let allowed = true

          if (specs.allowedDomains) {
            const allowedDomainsLower = field.item.specs.allowedDomains.map((d: string) =>
              d.toLowerCase(),
            )
            if (!allowedDomainsLower.includes(domain)) {
              allowed = false
            }
          }

          if (specs.exceptDomains) {
            const exceptDomainsLower = field.item.specs.exceptDomains.map((d: string) =>
              d.toLowerCase(),
            )
            if (exceptDomainsLower.includes(domain)) {
              allowed = false
            }
          }

          return {
            result: allowed,
            details: allowed ? '' : 'URL domain is not allowed',
          }
        }
      }
    }

    return output
  }

  static parseSelect(field: TableField<TableFieldSelect>) {
    const output: { type: StringConstructor | ArrayConstructor; rules?: Record<string, unknown> } =
      {
        type: String,
      }

    const specs = {
      mayBeEmpty: field.item.specs.mayBeEmpty === false,
    }

    output.rules = {}

    if (specs.mayBeEmpty) {
      output.rules.isNot = ''
    }

    if (field.item.specs.multiple) {
      output.type = Array
      output.rules.eachType = String

      if (
        Array.isArray(field.item.specs.allowedValues) &&
        field.item.specs.allowedValues.length > 0
      ) {
        output.rules.enum = field.item.specs.allowedValues
      }
    } else {
      if (
        Array.isArray(field.item.specs.allowedValues) &&
        field.item.specs.allowedValues.length > 0
      ) {
        output.rules.enum = field.item.specs.allowedValues
      }

      if (field.item.specs.mayBeEmpty === true) {
        if (!output.rules.enum) {
          output.rules.enum = []
        }

        ;(output.rules.enum as string[]).push('')
      }
    }

    return output
  }

  static parseRelation(field: TableField<TableFieldRelation>, options: ParseSchemaOptions) {
    const relationAsObjectId = options.relationAsObjectId ?? true

    const output: {
      type: StringConstructor | ArrayConstructor | typeof ObjectId;
      rules?: Record<string, unknown>
    } = { type: String }

    output.rules = {}

    if (field.item.specs.multiple) {
      output.type = Array
      output.rules.eachType = relationAsObjectId ? ObjectId : String
      
      output.rules.custom = (value: unknown, {}) => {
        if (field.item.specs.mayBeEmpty && Array.isArray(value) && value.length === 0) {
          return {
            result: true,
            details: '',
          }
        }

        const allStringsLength24 = Array.isArray(value) && value.every((v: any) => ObjectId.isValid(v))

        return {
          result: allStringsLength24,
          details: allStringsLength24 ? '' : 'One or more IDs are invalid',
        }
      }
    } else {
      output.type = relationAsObjectId ? ObjectId : String

      output.rules.custom = (value: unknown, {}) => {
        if (value === null || value === undefined) {
          return {
            result: false,
            details: 'ID is invalid'
          } 
        }
        
        const valueAsString = typeof value === 'string' ? value : value.toString()

        if (field.item.specs.mayBeEmpty && (typeof valueAsString === 'string' && valueAsString.length === 0)) {
          return {
            result: true,
            details: '',
          }
        }

        const stringLength24 = typeof valueAsString === 'string' && valueAsString.length === 24

        return {
          result: stringLength24,
          details: stringLength24 ? '' : 'ID is invalid',
        }
      }
    }

    return output
  }

  static parseSchema(schemaDb: TableField<TableFieldAny>[], parsesOptions?: ParseSchemaOptions): unknown {
    const options = { ...getDefaultOptions(), ...parsesOptions }

    const schema: Record<string, unknown> = {}
    const schemaFiltered = schemaDb.filter(
      (field) => field.item.key && !defaultKeys.includes(field.item.key),
    )

    for (const field of schemaFiltered) {
      const key = field.item.key
      const type = field.item.type

      switch (type) {
        case 'string':
          schema[key] = KodzeroToValidnoParser.parseString(field as TableField<TableFieldString>)
          break
        case 'number':
          schema[key] = KodzeroToValidnoParser.parseNumber(field as TableField<TableFieldNumber>)
          break
        case 'boolean':
          schema[key] = KodzeroToValidnoParser.parseBoolean(field as TableField<TableFieldBoolean>)
          break
        case 'date':
          schema[key] = KodzeroToValidnoParser.parseDate(field as TableField<TableFieldDate>)
          break
        case 'json':
          schema[key] = KodzeroToValidnoParser.parseJson(field as TableField<TableFieldJson>)
          break
        case 'email':
          schema[key] = KodzeroToValidnoParser.parseEmail(field as TableField<TableFieldEmail>)
          break
        case 'url':
          schema[key] = KodzeroToValidnoParser.parseUrl(field as TableField<TableFieldUrl>)
          break
        case 'select':
          schema[key] = KodzeroToValidnoParser.parseSelect(field as TableField<TableFieldSelect>)
          break
        case 'relation':
          schema[key] = KodzeroToValidnoParser.parseRelation(field as TableField<TableFieldRelation>, options)
          break
        default:
          break
      }
    }

    return schema
  }
}

export default KodzeroToValidnoParser
