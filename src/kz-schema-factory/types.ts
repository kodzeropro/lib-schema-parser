import TableFieldBoolean from './types-constructors/boolean.js'
import TableFieldDate from './types-constructors/date.js'
import TableFieldEmail from './types-constructors/email.js'
import TableFieldJson from './types-constructors/json.js'
import TableFieldNumber from './types-constructors/number.js'
import TableFieldSelect from './types-constructors/select.js'
import TableFieldString from './types-constructors/string.js'
import TableFieldUrl from './types-constructors/url.js'
import TableFieldRelation from './types-constructors/relation.js'
import TableFieldMarkdown from './fields-to-types/markdown.js'

export type TableField<T = Record<string, unknown>> = {
  id: string
  order: number
  isAuto?: boolean
  item: T
}

export type TableFieldAny =
  | TableFieldBoolean
  | TableFieldDate
  | TableFieldEmail
  | TableFieldJson
  | TableFieldMarkdown
  | TableFieldNumber
  | TableFieldRelation
  | TableFieldSelect
  | TableFieldString
  | TableFieldUrl

export interface TableFieldItem<Specs = Record<string, unknown>> {
  key: string
  type: string
  title: string
  specs: Specs
}

// Specifications by type
export interface BooleanSpecs {
  onlyTrue: boolean
}

export interface DateSpecs {
  min: Date | null
  max: Date | null
  mayBeEmpty: boolean
}

export interface EmailSpecs {
  allowedDomains: string[]
  exceptDomains: string[]
  mayBeEmpty: boolean
}

export interface JsonSpecs {
  maxSize: number
  mayBeEmpty: boolean
}

export interface MarkdownSpecs {
  mayBeEmpty: boolean
}

export interface NumberSpecs {
  min: number
  max: number
  mayBeEmpty: boolean
}

export interface RelationSpecs {
  collection: string
  multiple: boolean
  mayBeEmpty: boolean
}

export interface SelectSpecs {
  allowedValues: string[]
  multiple: boolean
  mayBeEmpty: boolean
}

export interface StringSpecs {
  lengthMin: number | null
  lengthMax: number | null
  mayBeEmpty: boolean
  pattern: string | null
}

export interface UrlSpecs {
  allowedDomains: string[]
  exceptDomains: string[]
  mayBeEmpty: boolean
}