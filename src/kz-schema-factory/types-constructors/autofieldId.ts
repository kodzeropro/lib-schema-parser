import { TableField } from '../types.js'
import TableFieldString from './string.js'

export const autofieldId: TableField<TableFieldString> = {
  id: 'autofield-id',
  item: {
    key: '_id',
    type: 'string',
    title: 'ID',
    specs: {
      lengthMax: 24,
      lengthMin: 24,
      mayBeEmpty: false,
      pattern: null,
    },
  },
  isAuto: true,
  order: -1001,
}
