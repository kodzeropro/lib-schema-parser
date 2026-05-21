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

export interface RelationSpecs {
  collection: string
  multiple: boolean
  mayBeEmpty: boolean
}
