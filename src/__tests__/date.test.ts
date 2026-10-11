import KodzeroToValidnoParser from '../KodzeroToValidnoParser.js';
import { TableField, TableFieldAny } from '../kz-schema-factory/types.js';
import TableFieldDate from '../kz-schema-factory/types-constructors/date.js';

describe('KodzeroToValidnoParser: date', () => {
    it('should preserve the noTimezone date setting', () => {
        const dateField = new TableFieldDate('dateWithoutTimezone', { noTimezone: true });
        expect(dateField.specs.noTimezone).toBe(true);

        const defaultDateField = new TableFieldDate('dateWithTimezone');
        expect(defaultDateField.specs.noTimezone).toBe(false);
    })

    it('should parse basic date field without specs', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'basicDate',
                    type: 'date',
                    title: 'Basic Date',
                    specs: {
                        min: null,
                        max: null,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const validnoSchema = {
            basicDate: { type: Date },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should parse date field with min date', () => {
        const minDate = new Date('2020-01-01');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'minDate',
                    type: 'date',
                    title: 'Date with Min',
                    specs: {
                        min: minDate,
                        max: null,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.minDate.type).toBe(Date)
        expect(typeof parsed.minDate.rules?.custom).toBe('function')
    })

    it('should parse date field with max date', () => {
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'maxDate',
                    type: 'date',
                    title: 'Date with Max',
                    specs: {
                        min: null,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.maxDate.type).toBe(Date)
        expect(typeof parsed.maxDate.rules?.custom).toBe('function')
    })

    it('should parse date field with min and max dates', () => {
        const minDate = new Date('2020-01-01');
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'boundedDate',
                    type: 'date',
                    title: 'Date with Min and Max',
                    specs: {
                        min: minDate,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.boundedDate.type).toBe(Date)
        expect(typeof parsed.boundedDate.rules?.custom).toBe('function')
    })

    it('should parse date field with mayBeEmpty false', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredDate',
                    type: 'date',
                    title: 'Required Date',
                    specs: {
                        min: null,
                        max: null,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const validnoSchema = {
            requiredDate: { type: Date, rules: { isNot: null } },
        }

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema);

        expect(validnoSchema).toEqual(parsed)
    })

    it('should validate date with min constraint - accepted date', () => {
        const minDate = new Date('2020-01-01');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'minDate',
                    type: 'date',
                    title: 'Date with Min',
                    specs: {
                        min: minDate,
                        max: null,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.minDate.rules?.custom as Function;

        const testDate = new Date('2023-06-15');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(true)
    })

    it('should validate date with min constraint - rejected date', () => {
        const minDate = new Date('2020-01-01');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'minDate',
                    type: 'date',
                    title: 'Date with Min',
                    specs: {
                        min: minDate,
                        max: null,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.minDate.rules?.custom as Function;

        const testDate = new Date('2019-12-31');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(false)
        expect(result.details).toBe('Date is out of allowed range')
    })

    it('should validate date with max constraint - accepted date', () => {
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'maxDate',
                    type: 'date',
                    title: 'Date with Max',
                    specs: {
                        min: null,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.maxDate.rules?.custom as Function;

        const testDate = new Date('2023-06-15');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(true)
    })

    it('should validate date with max constraint - rejected date', () => {
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'maxDate',
                    type: 'date',
                    title: 'Date with Max',
                    specs: {
                        min: null,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.maxDate.rules?.custom as Function;

        const testDate = new Date('2026-01-01');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(false)
        expect(result.details).toBe('Date is out of allowed range')
    })

    it('should validate date within min and max range', () => {
        const minDate = new Date('2020-01-01');
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'boundedDate',
                    type: 'date',
                    title: 'Date with Min and Max',
                    specs: {
                        min: minDate,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.boundedDate.rules?.custom as Function;

        const testDate = new Date('2023-06-15');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(true)
    })

    it('should validate date outside min and max range - too early', () => {
        const minDate = new Date('2020-01-01');
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'boundedDate',
                    type: 'date',
                    title: 'Date with Min and Max',
                    specs: {
                        min: minDate,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.boundedDate.rules?.custom as Function;

        const testDate = new Date('2019-12-31');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(false)
        expect(result.details).toBe('Date is out of allowed range')
    })

    it('should validate date outside min and max range - too late', () => {
        const minDate = new Date('2020-01-01');
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'boundedDate',
                    type: 'date',
                    title: 'Date with Min and Max',
                    specs: {
                        min: minDate,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.boundedDate.rules?.custom as Function;

        const testDate = new Date('2026-01-01');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(false)
        expect(result.details).toBe('Date is out of allowed range')
    })

    it('should parse date field with all specs combined', () => {
        const minDate = new Date('2020-01-01');
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'fullSpecDate',
                    type: 'date',
                    title: 'Date with All Specs',
                    specs: {
                        min: minDate,
                        max: maxDate,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.fullSpecDate.type).toBe(Date)
        expect(parsed.fullSpecDate.rules?.isNot).toBe(null)
        expect(typeof parsed.fullSpecDate.rules?.custom).toBe('function')
    })

    it('should parse multiple date fields with different specs', () => {
        const minDate = new Date('2020-01-01');
        const maxDate = new Date('2025-12-31');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'basicDate',
                    type: 'date',
                    title: 'Basic Date',
                    specs: {
                        min: null,
                        max: null,
                        mayBeEmpty: true,
                    }
                }
            },
            {
                id: 'yyy',
                order: 2,
                isAuto: false,
                item: {
                    key: 'requiredDate',
                    type: 'date',
                    title: 'Required Date',
                    specs: {
                        min: minDate,
                        max: null,
                        mayBeEmpty: false,
                    }
                }
            },
            {
                id: 'zzz',
                order: 3,
                isAuto: false,
                item: {
                    key: 'boundedDate',
                    type: 'date',
                    title: 'Bounded Date',
                    specs: {
                        min: minDate,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.basicDate.type).toBe(Date)
        expect(parsed.basicDate.rules).toBeUndefined()
        expect(parsed.requiredDate.type).toBe(Date)
        expect(parsed.requiredDate.rules?.isNot).toBe(null)
        expect(parsed.boundedDate.type).toBe(Date)
        expect(typeof parsed.requiredDate.rules?.custom).toBe('function')
        expect(typeof parsed.boundedDate.rules?.custom).toBe('function')
    })

    it('should validate date at exact min boundary', () => {
        const minDate = new Date('2020-01-01T00:00:00.000Z');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'minDate',
                    type: 'date',
                    title: 'Date with Min',
                    specs: {
                        min: minDate,
                        max: null,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.minDate.rules?.custom as Function;

        const testDate = new Date('2020-01-01T00:00:00.000Z');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(true)
    })

    it('should validate date at exact max boundary', () => {
        const maxDate = new Date('2025-12-31T23:59:59.999Z');
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'maxDate',
                    type: 'date',
                    title: 'Date with Max',
                    specs: {
                        min: null,
                        max: maxDate,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        const customValidator = parsed.maxDate.rules?.custom as Function;

        const testDate = new Date('2025-12-31T23:59:59.999Z');
        const result = customValidator(testDate, {});
        expect(result.result).toBe(true)
    })
})
