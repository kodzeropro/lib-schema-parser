import KodzeroToValidnoParser from '../KodzeroToValidnoParser.js';
import { TableField, TableFieldAny } from '../kz-schema-factory/types.js';

describe('KodzeroToValidnoParser: select', () => {
    it('should parse basic select field (single select, no specs)', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'basicSelect',
                    type: 'select',
                    title: 'Basic Select',
                    specs: {
                        multiple: false,
                        mayBeEmpty: true,
                        allowedValues: [],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.basicSelect.type).toBe(String)
        expect(parsed.basicSelect.rules?.enum).toContain('')
    })

    it('should parse single select with allowedValues', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'singleSelect',
                    type: 'select',
                    title: 'Single Select',
                    specs: {
                        multiple: false,
                        mayBeEmpty: true,
                        allowedValues: ['option1', 'option2', 'option3'],
                    }
                }
            },
        ]

        const validnoSchema = {
            singleSelect: { type: String, rules: { enum: ['option1', 'option2', 'option3', ''] } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse single select with mayBeEmpty false', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredSelect',
                    type: 'select',
                    title: 'Required Select',
                    specs: {
                        multiple: false,
                        mayBeEmpty: false,
                        allowedValues: ['option1', 'option2', 'option3'],
                    }
                }
            },
        ]

        const validnoSchema = {
            requiredSelect: { type: String, rules: { enum: ['option1', 'option2', 'option3'], isNot: '' } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse multiple select field', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'multiSelect',
                    type: 'select',
                    title: 'Multi Select',
                    specs: {
                        multiple: true,
                        mayBeEmpty: true,
                        allowedValues: ['option1', 'option2', 'option3'],
                    }
                }
            },
        ]

        const validnoSchema = {
            multiSelect: { type: Array, rules: { eachType: String, enum: ['option1', 'option2', 'option3'] } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse multiple select with mayBeEmpty false', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredMultiSelect',
                    type: 'select',
                    title: 'Required Multi Select',
                    specs: {
                        multiple: true,
                        mayBeEmpty: false,
                        allowedValues: ['option1', 'option2', 'option3'],
                    }
                }
            },
        ]

        const validnoSchema = {
            requiredMultiSelect: { 
                type: Array, 
                rules: { 
                    eachType: String, 
                    enum: ['option1', 'option2', 'option3'],
                    lengthNot: 0
                } 
            },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse multiple select without allowedValues', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'multiSelect',
                    type: 'select',
                    title: 'Multi Select',
                    specs: {
                        multiple: true,
                        mayBeEmpty: true,
                        allowedValues: [],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.multiSelect.type).toBe(Array)
        expect(parsed.multiSelect.rules?.eachType).toBe(String)
        expect(parsed.multiSelect.rules?.enum).toBeUndefined()
    })

    it('should parse select field for status selection', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'status',
                    type: 'select',
                    title: 'Status',
                    specs: {
                        multiple: false,
                        mayBeEmpty: false,
                        allowedValues: ['active', 'inactive', 'pending'],
                    }
                }
            },
        ]

        const validnoSchema = {
            status: { type: String, rules: { enum: ['active', 'inactive', 'pending'], isNot: '' } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse select field for role selection', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'role',
                    type: 'select',
                    title: 'Role',
                    specs: {
                        multiple: false,
                        mayBeEmpty: false,
                        allowedValues: ['admin', 'editor', 'viewer'],
                    }
                }
            },
        ]

        const validnoSchema = {
            role: { type: String, rules: { enum: ['admin', 'editor', 'viewer'], isNot: '' } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse select field for tags (multiple)', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'tags',
                    type: 'select',
                    title: 'Tags',
                    specs: {
                        multiple: true,
                        mayBeEmpty: true,
                        allowedValues: ['javascript', 'typescript', 'python', 'java'],
                    }
                }
            },
        ]

        const validnoSchema = {
            tags: { 
                type: Array, 
                rules: { 
                    eachType: String, 
                    enum: ['javascript', 'typescript', 'python', 'java']
                } 
            },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse select field for categories (multiple, required)', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'categories',
                    type: 'select',
                    title: 'Categories',
                    specs: {
                        multiple: true,
                        mayBeEmpty: false,
                        allowedValues: ['tech', 'business', 'lifestyle', 'entertainment'],
                    }
                }
            },
        ]

        const validnoSchema = {
            categories: { 
                type: Array, 
                rules: { 
                    eachType: String, 
                    enum: ['tech', 'business', 'lifestyle', 'entertainment'],
                    lengthNot: 0
                } 
            },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse multiple select fields with different specs', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'singleSelect',
                    type: 'select',
                    title: 'Single Select',
                    specs: {
                        multiple: false,
                        mayBeEmpty: true,
                        allowedValues: ['option1', 'option2'],
                    }
                }
            },
            {
                id: 'yyy',
                order: 2,
                isAuto: false,
                item: {
                    key: 'requiredSingle',
                    type: 'select',
                    title: 'Required Single',
                    specs: {
                        multiple: false,
                        mayBeEmpty: false,
                        allowedValues: ['yes', 'no'],
                    }
                }
            },
            {
                id: 'zzz',
                order: 3,
                isAuto: false,
                item: {
                    key: 'multiSelect',
                    type: 'select',
                    title: 'Multi Select',
                    specs: {
                        multiple: true,
                        mayBeEmpty: true,
                        allowedValues: ['tag1', 'tag2', 'tag3'],
                    }
                }
            },
        ]

        const validnoSchema = {
            singleSelect: { type: String, rules: { enum: ['option1', 'option2', ''] } },
            requiredSingle: { type: String, rules: { enum: ['yes', 'no'], isNot: '' } },
            multiSelect: { type: Array, rules: { eachType: String, enum: ['tag1', 'tag2', 'tag3'] } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse select field with single allowedValue', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'singleOption',
                    type: 'select',
                    title: 'Single Option',
                    specs: {
                        multiple: false,
                        mayBeEmpty: false,
                        allowedValues: ['only-option'],
                    }
                }
            },
        ]

        const validnoSchema = {
            singleOption: { type: String, rules: { enum: ['only-option'], isNot: '' } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse select field with numeric-like string values', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'rating',
                    type: 'select',
                    title: 'Rating',
                    specs: {
                        multiple: false,
                        mayBeEmpty: false,
                        allowedValues: ['1', '2', '3', '4', '5'],
                    }
                }
            },
        ]

        const validnoSchema = {
            rating: { type: String, rules: { enum: ['1', '2', '3', '4', '5'], isNot: '' } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse select field with special characters in values', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'specialSelect',
                    type: 'select',
                    title: 'Special Select',
                    specs: {
                        multiple: false,
                        mayBeEmpty: true,
                        allowedValues: ['option-1', 'option_2', 'option.3', 'option@4'],
                    }
                }
            },
        ]

        const validnoSchema = {
            specialSelect: { type: String, rules: { enum: ['option-1', 'option_2', 'option.3', 'option@4', ''] } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse select field with long values', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'longSelect',
                    type: 'select',
                    title: 'Long Select',
                    specs: {
                        multiple: false,
                        mayBeEmpty: false,
                        allowedValues: [
                            'This is a very long option value',
                            'Another long option with multiple words',
                        ],
                    }
                }
            },
        ]

        const validnoSchema = {
            longSelect: { 
                type: String, 
                rules: { 
                    enum: [
                        'This is a very long option value',
                        'Another long option with multiple words',
                    ],
                    isNot: '' 
                } 
            },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should handle empty string in enum for optional single select', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'optionalSelect',
                    type: 'select',
                    title: 'Optional Select',
                    specs: {
                        multiple: false,
                        mayBeEmpty: true,
                        allowedValues: ['value1', 'value2'],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.optionalSelect.type).toBe(String)
        expect(parsed.optionalSelect.rules?.enum).toContain('')
        expect(parsed.optionalSelect.rules?.enum).toContain('value1')
        expect(parsed.optionalSelect.rules?.enum).toContain('value2')
        expect(parsed.optionalSelect.rules?.enum?.length).toBe(3)
    })

    it('should reject empty array for multiple select when mayBeEmpty is false', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredMultiSelect',
                    type: 'select',
                    title: 'Required Multi Select',
                    specs: {
                        multiple: true,
                        mayBeEmpty: false,
                        allowedValues: ['option1', 'option2', 'option3'],
                    }
                }
            },
        ]

        const validnoSchema = {
            requiredMultiSelect: { 
                type: Array, 
                rules: { 
                    eachType: String, 
                    enum: ['option1', 'option2', 'option3'],
                    lengthNot: 0
                } 
            },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })
})
