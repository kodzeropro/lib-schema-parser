import KodzeroToValidnoParser from '../KodzeroToValidnoParser.js';
import { TableField, TableFieldAny } from '../kz-schema-factory/types.js';

describe('KodzeroToValidnoParser: markdown', () => {
    it('should parse markdown field with default specs', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'basicMarkdown',
                    type: 'markdown',
                    title: 'Basic Markdown',
                    specs: {
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const validnoSchema = {
            basicMarkdown: { type: String },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse markdown field with mayBeEmpty false', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredMarkdown',
                    type: 'markdown',
                    title: 'Required Markdown',
                    specs: {
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const validnoSchema = {
            requiredMarkdown: { type: String, rules: { lengthNot: 0 } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })
})