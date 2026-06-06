import TableFieldFile from "../kz-schema-factory/types-constructors/file.js";
import { AttachedFile, TableField } from "../kz-schema-factory/types.js";

const isAttachedFile = (value: unknown): value is AttachedFile => {
    if (typeof value !== 'object' || value === null) {
      return false
    }

    const file = value as Record<string, unknown>

    return (
      typeof file.path === 'string' &&
      typeof file.name === 'string' &&
      typeof file.mimeType === 'string' &&
      typeof file.size === 'number' &&
      Number.isFinite(file.size) &&
      file.size >= 0
    )
  }

const parseFile = (field: TableField<TableFieldFile>) => {
    const isMultipleFile = field.item.specs.multiple === true
    const valueMayBeEmpty = field.item.specs.mayBeEmpty === true

    const output = {
        type: isMultipleFile ? Array : Object,
        rules: {} as Record<string, any>,
    }

    const specsPresent = {
      multiple: field.item.specs.multiple === true,
      mayBeEmpty: field.item.specs.mayBeEmpty === false,
      maxSize: typeof field.item.specs.maxSize === 'number' && field.item.specs.maxSize > 0,
      allowedMimeTypes:
        Array.isArray(field.item.specs.allowedMimeTypes) && field.item.specs.allowedMimeTypes.length > 0,
    }

    if (specsPresent.multiple) {
        output.type = Array

        if (valueMayBeEmpty === false) {
            output.rules.lengthNot = 0
        }

        output.rules.custom = (value: unknown, {}) => {
            if (!Array.isArray(value)) {
                return {
                    result: false,
                    details: 'Invalid file value',
                }
            }

            if (field.item.specs.mayBeEmpty && value.length === 0) {
                return {
                    result: true,
                    details: '',
                }
            }

            const allowedMimeTypes = field.item.specs.allowedMimeTypes.map((mime) => mime.toLowerCase())

            const isValid = value.every((file) => {
            if (!isAttachedFile(file)) {
                return false
            }

            const mimeTypeAllowed =
                !specsPresent.allowedMimeTypes || allowedMimeTypes.includes(file.mimeType.toLowerCase())
            const sizeAllowed = !specsPresent.maxSize || file.size <= field.item.specs.maxSize

            return mimeTypeAllowed && sizeAllowed
            })

            return {
                result: isValid,
                details: isValid ? '' : 'One or more files are invalid',
            }
        }
    } else {
        if (specsPresent.mayBeEmpty) {
            output.rules.isNot = null
        }

        output.rules.custom = (value: unknown, {}) => {
            if (field.item.specs.mayBeEmpty && (value === null || value === undefined)) {
                return {
                    result: true,
                    details: '',
                }
            }

            if (!isAttachedFile(value)) {
                return {
                    result: false,
                    details: 'Invalid file value',
                }
            }

            const allowedMimeTypes = field.item.specs.allowedMimeTypes.map((mime) => mime.toLowerCase())
            const mimeTypeAllowed = !specsPresent.allowedMimeTypes || allowedMimeTypes.includes(value.mimeType.toLowerCase())
            const sizeAllowed = !specsPresent.maxSize || value.size <= field.item.specs.maxSize
            const isValid = mimeTypeAllowed && sizeAllowed

            return {
                result: isValid,
                details: isValid ? '' : 'File is invalid',
            }
        }
    }

    return output
}

export default parseFile