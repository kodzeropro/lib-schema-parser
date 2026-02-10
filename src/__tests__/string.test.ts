import KodzeroToValidnoParser from '../KodzeroToValidnoParser.js';
import { TableField, TableFieldAny } from '../kz-schema-factory/types.js';

describe('KodzeroToValidnoParser: string', () => {
    it('should parse basic string field without specs', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'basicString',
                    type: 'string',
                    title: 'Basic String',
                    specs: {
                        lengthMin: null,
                        lengthMax: null,
                        mayBeEmpty: true,
                        pattern: null,
                    }
                }
            },
        ]

        const validnoSchema = {
            basicString: { type: String },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse string field with lengthMin', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'minLengthString',
                    type: 'string',
                    title: 'String with Min Length',
                    specs: {
                        lengthMin: 5,
                        lengthMax: null,
                        mayBeEmpty: true,
                        pattern: null,
                    }
                }
            },
        ]

        const validnoSchema = {
            minLengthString: { type: String, rules: { lengthMin: 5 } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse string field with lengthMax', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'maxLengthString',
                    type: 'string',
                    title: 'String with Max Length',
                    specs: {
                        lengthMin: null,
                        lengthMax: 100,
                        mayBeEmpty: true,
                        pattern: null,
                    }
                }
            },
        ]

        const validnoSchema = {
            maxLengthString: { type: String, rules: { lengthMax: 100 } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse string field with lengthMin and lengthMax', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'boundedString',
                    type: 'string',
                    title: 'String with Min and Max Length',
                    specs: {
                        lengthMin: 5,
                        lengthMax: 50,
                        mayBeEmpty: true,
                        pattern: null,
                    }
                }
            },
        ]

        const validnoSchema = {
            boundedString: { type: String, rules: { lengthMin: 5, lengthMax: 50 } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse string field with mayBeEmpty false', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredString',
                    type: 'string',
                    title: 'Required String',
                    specs: {
                        lengthMin: null,
                        lengthMax: null,
                        mayBeEmpty: false,
                        pattern: null,
                    }
                }
            },
        ]

        const validnoSchema = {
            requiredString: { type: String, rules: { lengthNot: 0 } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse string field with pattern', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'patternString',
                    type: 'string',
                    title: 'String with Pattern',
                    specs: {
                        lengthMin: null,
                        lengthMax: null,
                        mayBeEmpty: true,
                        pattern: '^[A-Z][a-z]+$',
                    }
                }
            },
        ]

        const validnoSchema = {
            patternString: { type: String, rules: { regex: /^[A-Z][a-z]+$/ } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse string field with all specs combined', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'fullSpecString',
                    type: 'string',
                    title: 'String with All Specs',
                    specs: {
                        lengthMin: 3,
                        lengthMax: 20,
                        mayBeEmpty: false,
                        pattern: '^[a-zA-Z0-9]+$',
                    }
                }
            },
        ]

        const validnoSchema = {
            fullSpecString: { 
                type: String, 
                rules: { 
                    lengthMax: 20, 
                    lengthMin: 3, 
                    regex: /^[a-zA-Z0-9]+$/, 
                    lengthNot: 0 
                } 
            },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse multiple string fields with different specs', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'basicString',
                    type: 'string',
                    title: 'Basic String',
                    specs: {
                        lengthMin: null,
                        lengthMax: null,
                        mayBeEmpty: true,
                        pattern: null,
                    }
                }
            },
            {
                id: 'yyy',
                order: 2,
                isAuto: false,
                item: {
                    key: 'requiredString',
                    type: 'string',
                    title: 'Required String',
                    specs: {
                        lengthMin: 1,
                        lengthMax: 100,
                        mayBeEmpty: false,
                        pattern: null,
                    }
                }
            },
            {
                id: 'zzz',
                order: 3,
                isAuto: false,
                item: {
                    key: 'patternString',
                    type: 'string',
                    title: 'Pattern String',
                    specs: {
                        lengthMin: null,
                        lengthMax: null,
                        mayBeEmpty: true,
                        pattern: '^\\d{3}-\\d{2}-\\d{4}$',
                    }
                }
            },
        ]

        const validnoSchema = {
            basicString: { type: String },
            requiredString: { type: String, rules: { lengthMin: 1, lengthMax: 100, lengthNot: 0 } },
            patternString: { type: String, rules: { regex: /^\d{3}-\d{2}-\d{4}$/ } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })
})