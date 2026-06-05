import { TableField } from '../types.js'
import TableFieldDate from './date.js'

export const autofieldUpdatedAt: TableField<TableFieldDate> = {
  id: 'autofield-updatedat',
  item: {
    key: 'updatedAt',
    type: 'date',
    title: 'Updated At',
    specs: {
      max: null,
      min: null,
      mayBeEmpty: false,
    },
  },
  isAuto: true,
  order: 1002,
}
