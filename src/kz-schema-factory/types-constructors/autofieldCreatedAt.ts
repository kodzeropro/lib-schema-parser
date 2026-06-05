import { TableField } from '../types.js'
import TableFieldDate from './date.js'

export const autofieldCreatedAt: TableField<TableFieldDate> = {
  id: 'autofield-createdat',
  item: {
    key: 'createdAt',
    type: 'date',
    title: 'Created At',
    specs: {
      max: null,
      min: null,
      mayBeEmpty: true,
    },
  },
  isAuto: true,
  order: 1001,
}
