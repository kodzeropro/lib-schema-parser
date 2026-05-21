// Types
import TableFieldBoolean from './types-constructors/boolean.js'
import TableFieldDate from './types-constructors/date.js'
import TableFieldEmail from './types-constructors/email.js'
import TableFieldJson from './types-constructors/json.js'
import TableFieldNumber from './types-constructors/number.js'
import TableFieldSelect from './types-constructors/select.js'
import TableFieldString from './types-constructors/string.js'
import TableFieldUrl from './types-constructors/url.js'
import TableFieldRelation from './types-constructors/relation.js'
import TableFieldMarkdown from './types-constructors/markdown.js'
import type {
  BooleanSpecs,
  DateSpecs,
  EmailSpecs,
  JsonSpecs,
  MarkdownSpecs,
  NumberSpecs,
  RelationSpecs,
  SelectSpecs,
  StringSpecs,
  UrlSpecs,
} from './types.js'
import generateSecret from '../utils/generate-secret.js'

export type TableFieldAny =
  | TableFieldBoolean
  | TableFieldDate
  | TableFieldEmail
  | TableFieldMarkdown
  | TableFieldJson
  | TableFieldNumber
  | TableFieldSelect
  | TableFieldString
  | TableFieldUrl

type IndexItem = { key: string; isUnique: boolean }

export type TableField<T> = {
  id: string
  order: number
  isAuto?: boolean
  item: T
}

class CollectionConfig {
  items: TableField<TableFieldAny>[]
  totalQty: number
  indexes: Array<IndexItem>

  constructor(items: TableField<TableFieldAny>[] = []) {
    this.totalQty = items.length || 0
    this.indexes = []
    this.items = items.map((el, i) => ({ ...el, order: i }))
  }

  add(item: TableFieldAny) {
    const id = generateSecret(12)
    const itemWrapped: TableField<TableFieldAny> = { id, item, order: this.totalQty }
    this.items.push(itemWrapped)
    this.totalQty = this.items.length
  }

  copyById(id: string) {
    const originalItem = this.items.find((el) => el.id === id)
    if (!originalItem) return

    const itemCopy = Object.create(
      Object.getPrototypeOf(originalItem.item),
      Object.getOwnPropertyDescriptors(originalItem.item),
    ) as TableFieldAny
    itemCopy.key += '-copy'

    this.add(itemCopy)
    this.move(this.totalQty - 1, originalItem.order + 1)
  }

  remove(order: number) {
    this.items = this.items.filter((col) => col.order !== order)
    this.totalQty = this.items.length
  }

  removeById(id: string) {
    this.items = this.items.filter((col) => col.id !== id)
    this.totalQty = this.items.length
  }

  updateNameById(id: string, name: string) {
    const index = this.items.findIndex((el) => el.id === id)
    this.items[index].item.key = name
  }

  updateSpecsById(id: string, newSpecs: TableFieldAny['specs']) {
    const index = this.items.findIndex((el) => el.id === id)
    this.items[index].item.specs = newSpecs
  }

  move(from: number, to: number) {
    if (from === to) return
    const fromIndex = this.items.findIndex((item) => item.order === from)
    let toIndex = this.items.findIndex((item) => item.order === to)

    // If moving to the very end of the list
    // Ignore arguments that are out of bounds
    if (to >= this.items.length) {
      toIndex = this.items.length - 1
    } else if (to < 0) {
      toIndex = 0
    }

    if (fromIndex === -1 || toIndex === -1) return

    const [movedItem] = this.items.splice(fromIndex, 1)
    this.items.splice(toIndex, 0, movedItem)

    // Reassign orders
    this.items.forEach((col, index) => {
      col.order = index
    })
  }
}

export class TableFieldCreator {
  static create(key: string, type: string, settings: unknown = {}) {
    switch (type) {
      case 'boolean':
        return new TableFieldBoolean(key)
      case 'string':
        return new TableFieldString(key, settings as Partial<StringSpecs>)
      case 'number':
        return new TableFieldNumber(key, settings as Partial<NumberSpecs>)
      case 'date':
        return new TableFieldDate(key, settings as Partial<DateSpecs>)
      case 'email':
        return new TableFieldEmail(key, settings as Partial<EmailSpecs>)
      case 'json':
        return new TableFieldJson(key, settings as Partial<JsonSpecs>)
      case 'select':
        return new TableFieldSelect(key, settings as Partial<SelectSpecs>)
      case 'url':
        return new TableFieldUrl(key, settings as Partial<UrlSpecs>)
      case 'relation':
        return new TableFieldRelation(key, settings as Partial<RelationSpecs>)
      case 'markdown':
        return new TableFieldMarkdown(key, settings as Partial<MarkdownSpecs>)
      default:
        throw new Error(`Unsupported config type: ${type}`)
    }
  }

  static createBoolean(key: string, settings: Partial<BooleanSpecs>) {
    return new TableFieldBoolean(key, settings)
  }

  static createString(key: string, settings: Partial<StringSpecs> = {}) {
    return new TableFieldString(key, settings)
  }

  static createNumber(key: string, settings: Partial<NumberSpecs> = {}) {
    return new TableFieldNumber(key, settings)
  }

  static createDate(key: string, settings: Partial<DateSpecs> = {}) {
    return new TableFieldDate(key, settings)
  }

  static createEmail(key: string, settings: Partial<EmailSpecs> = {}) {
    return new TableFieldEmail(key, settings)
  }

  static createJson(key: string, settings: Partial<JsonSpecs> = {}) {
    return new TableFieldJson(key, settings)
  }

  static createSelect(key: string, settings: Partial<SelectSpecs> = {}) {
    return new TableFieldSelect(key, settings)
  }

  static createUrl(key: string, settings: Partial<UrlSpecs> = {}) {
    return new TableFieldUrl(key, settings)
  }

  static createRelation(key: string, settings: Partial<RelationSpecs> = {}) {
    return new TableFieldRelation(key, settings)
  }

  static createMarkdown(key: string, settings: Partial<MarkdownSpecs> = {}) {
    return new TableFieldMarkdown(key, settings)
  }
}

export default CollectionConfig
