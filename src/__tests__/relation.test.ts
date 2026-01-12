import KodzeroToValidnoParser from '../KodzeroToValidnoParser.js';
import { TableField, TableFieldAny } from '../kz-schema-factory/types.js';
import { ObjectId } from 'bson';

describe('KodzeroToValidnoParser: relation', () => {
    it('should parse basic relation field without specs', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'basicRelation',
                    type: 'relation',
                    title: 'Basic Relation',
                    specs: {
                        collection: 'users',
                        multiple: false,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.basicRelation.type).toBe(String)
        expect(parsed.basicRelation.rules).toBeDefined()
    })

    it('should parse relation field with mayBeEmpty false', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredRelation',
                    type: 'relation',
                    title: 'Required Relation',
                    specs: {
                        collection: 'categories',
                        multiple: false,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.requiredRelation.type).toBe(String)
    })

    it('should parse single relation field (multiple: false)', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'singleRelation',
                    type: 'relation',
                    title: 'Single Relation',
                    specs: {
                        collection: 'authors',
                        multiple: false,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.singleRelation.type).toBe(String)
        expect(parsed.singleRelation.rules).toBeDefined()
    })

    it('should parse multiple relation field (multiple: true)', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'multipleRelation',
                    type: 'relation',
                    title: 'Multiple Relation',
                    specs: {
                        collection: 'tags',
                        multiple: true,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.multipleRelation.type).toBe(Array)
        expect(parsed.multipleRelation.rules?.eachType).toBe(String)
        expect(parsed.multipleRelation.rules?.custom).toBeDefined()
        expect(typeof parsed.multipleRelation.rules?.custom).toBe('function')
    })

    it('should parse required single relation', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredSingleRelation',
                    type: 'relation',
                    title: 'Required Single Relation',
                    specs: {
                        collection: 'organizations',
                        multiple: false,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.requiredSingleRelation.type).toBe(String)
    })

    it('should parse required multiple relation', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredMultipleRelation',
                    type: 'relation',
                    title: 'Required Multiple Relation',
                    specs: {
                        collection: 'skills',
                        multiple: true,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.requiredMultipleRelation.type).toBe(Array)
        expect(parsed.requiredMultipleRelation.rules?.custom).toBeDefined()
        expect(typeof parsed.requiredMultipleRelation.rules?.custom).toBe('function')
        expect(parsed.requiredMultipleRelation.rules?.eachType).toBe(String)
    })

    it('should parse optional multiple relation', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'optionalMultipleRelation',
                    type: 'relation',
                    title: 'Optional Multiple Relation',
                    specs: {
                        collection: 'collaborators',
                        multiple: true,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.optionalMultipleRelation.rules?.custom).toBeDefined()
        expect(typeof parsed.optionalMultipleRelation.rules?.custom).toBe('function')
        expect(parsed.optionalMultipleRelation.type).toBe(Array)
        expect(parsed.optionalMultipleRelation.rules?.eachType).toBe(String)
    })

    it('should parse relation field referencing different collections', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'userRelation',
                    type: 'relation',
                    title: 'User Relation',
                    specs: {
                        collection: 'users',
                        multiple: false,
                        mayBeEmpty: true,
                    }
                }
            },
            {
                id: 'yyy',
                order: 2,
                isAuto: false,
                item: {
                    key: 'categoryRelation',
                    type: 'relation',
                    title: 'Category Relation',
                    specs: {
                        collection: 'categories',
                        multiple: false,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.userRelation.type).toBe(String)
        expect(parsed.categoryRelation.type).toBe(String)
    })

    it('should parse multiple relation fields with different specs', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'optionalSingleRelation',
                    type: 'relation',
                    title: 'Optional Single Relation',
                    specs: {
                        collection: 'authors',
                        multiple: false,
                        mayBeEmpty: true,
                    }
                }
            },
            {
                id: 'yyy',
                order: 2,
                isAuto: false,
                item: {
                    key: 'requiredSingleRelation',
                    type: 'relation',
                    title: 'Required Single Relation',
                    specs: {
                        collection: 'publishers',
                        multiple: false,
                        mayBeEmpty: false,
                    }
                }
            },
            {
                id: 'zzz',
                order: 3,
                isAuto: false,
                item: {
                    key: 'optionalMultipleRelation',
                    type: 'relation',
                    title: 'Optional Multiple Relation',
                    specs: {
                        collection: 'tags',
                        multiple: true,
                        mayBeEmpty: true,
                    }
                }
            },
            {
                id: 'aaa',
                order: 4,
                isAuto: false,
                item: {
                    key: 'requiredMultipleRelation',
                    type: 'relation',
                    title: 'Required Multiple Relation',
                    specs: {
                        collection: 'categories',
                        multiple: true,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        // Optional Single
        expect(parsed.optionalSingleRelation.type).toBe(String)
        expect(parsed.optionalSingleRelation.rules?.custom).toBeDefined()

        // Required Single
        expect(parsed.requiredSingleRelation.type).toBe(String)
        expect(parsed.requiredSingleRelation.rules?.custom).toBeDefined()

        // Optional Multiple
        expect(parsed.optionalMultipleRelation.type).toBe(Array)
        expect(parsed.optionalMultipleRelation.rules?.eachType).toBe(String)
        expect(parsed.optionalMultipleRelation.rules?.isNot).toBeUndefined()
        expect(parsed.optionalMultipleRelation.rules?.custom).toBeDefined()

        // Required Multiple
        expect(parsed.requiredMultipleRelation.type).toBe(Array)
        expect(parsed.requiredMultipleRelation.rules?.eachType).toBe(String)
        expect(parsed.requiredMultipleRelation.rules?.custom).toBeDefined()
    })

    it('should handle relation with empty collection name', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'emptyCollectionRelation',
                    type: 'relation',
                    title: 'Empty Collection Relation',
                    specs: {
                        collection: '',
                        multiple: false,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        expect(parsed.emptyCollectionRelation.type).toBe(String)
    })

    it('should preserve specs combination - required multiple relation', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'tags',
                    type: 'relation',
                    title: 'Tags',
                    specs: {
                        collection: 'tags',
                        multiple: true,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        // Should be Array with eachType, isNot, and custom rules
        expect(parsed.tags.type).toBe(Array)
        expect(parsed.tags.rules?.eachType).toBe(String)
        expect(parsed.tags.rules?.custom).toBeDefined()
        expect(typeof parsed.tags.rules?.custom).toBe('function')
    })

    it('should handle relation field with all default specs', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'defaultRelation',
                    type: 'relation',
                    title: 'Default Relation',
                    specs: {
                        collection: '',
                        multiple: false,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

        // Should have String type with no rules
        expect(parsed.defaultRelation.type).toBe(String)
        expect(parsed.defaultRelation.rules.custom).toBeDefined()
    })

    it('should validate 24-character IDs in multiple relation custom validator', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'tags',
                    type: 'relation',
                    title: 'Tags',
                    specs: {
                        collection: 'tags',
                        multiple: true,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;
        const customValidator = parsed.tags.rules?.custom

        // Valid: all IDs are 24 characters
        const validResult = customValidator(['507f1f77bcf86cd799439011', '507f191e810c19729de860ea'], {})
        expect(validResult.result).toBe(true)
        expect(validResult.details).toBe('')

        // Invalid: one ID is not 24 characters
        const invalidResult = customValidator(['507f1f77bcf86cd799439011', 'short'], {})
        expect(invalidResult.result).toBe(false)
        expect(invalidResult.details).toBe('One or more IDs are invalid')

        // Invalid: empty string
        const emptyStringResult = customValidator(['507f1f77bcf86cd799439011', ''], {})
        expect(emptyStringResult.result).toBe(false)
        expect(emptyStringResult.details).toBe('One or more IDs are invalid')
    })

    it('should allow empty array for optional multiple relation', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'optionalTags',
                    type: 'relation',
                    title: 'Optional Tags',
                    specs: {
                        collection: 'tags',
                        multiple: true,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;
        const customValidator = parsed.optionalTags.rules?.custom

        // Empty array should be valid when mayBeEmpty is true
        const emptyArrayResult = customValidator([], {})
        expect(emptyArrayResult.result).toBe(true)
        expect(emptyArrayResult.details).toBe('')

        // Valid IDs should still work
        const validResult = customValidator(['507f1f77bcf86cd799439011'], {})
        expect(validResult.result).toBe(true)
        expect(validResult.details).toBe('')
    })

    it('should reject empty array for required multiple relation', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'requiredTags',
                    type: 'relation',
                    title: 'Required Tags',
                    specs: {
                        collection: 'tags',
                        multiple: true,
                        mayBeEmpty: false,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;
        const customValidator = parsed.requiredTags.rules?.custom

        // Empty array passes custom validator (ID format check)
        // but should fail the isNot rule
        const emptyArrayResult = customValidator([], {})
        expect(emptyArrayResult.result).toBe(true) // empty array passes .every() check
    })

    it('should validate mixed valid and invalid IDs in array', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'tags',
                    type: 'relation',
                    title: 'Tags',
                    specs: {
                        collection: 'tags',
                        multiple: true,
                        mayBeEmpty: true,
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;
        const customValidator = parsed.tags.rules?.custom

        // Multiple valid IDs
        const multipleValidResult = customValidator([
            '507f1f77bcf86cd799439011',
            '507f191e810c19729de860ea',
            '507f1f77bcf86cd799439012'
        ], {})
        expect(multipleValidResult.result).toBe(true)

        // Mix of valid and invalid
        const mixedResult = customValidator([
            '507f1f77bcf86cd799439011',
            'invalid',
            '507f191e810c19729de860ea'
        ], {})
        expect(mixedResult.result).toBe(false)
        expect(mixedResult.details).toBe('One or more IDs are invalid')

        // All invalid
        const allInvalidResult = customValidator(['abc', '123', 'xyz'], {})
        expect(allInvalidResult.result).toBe(false)
        expect(allInvalidResult.details).toBe('One or more IDs are invalid')
    })

    describe('relationAsObjectId option (backend mode)', () => {
        it('should parse single relation as ObjectId when relationAsObjectId is true', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'singleRelation',
                        type: 'relation',
                        title: 'Single Relation',
                        specs: {
                            collection: 'users',
                            multiple: false,
                            mayBeEmpty: true,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: true }) as any;

            expect(parsed.singleRelation.type).toBe(ObjectId)
            expect(parsed.singleRelation.rules).toBeDefined()
            expect(parsed.singleRelation.rules.custom).toBeDefined()
        })

        it('should parse multiple relation with ObjectId eachType when relationAsObjectId is true', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'multipleRelation',
                        type: 'relation',
                        title: 'Multiple Relation',
                        specs: {
                            collection: 'tags',
                            multiple: true,
                            mayBeEmpty: true,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: true }) as any;

            expect(parsed.multipleRelation.type).toBe(Array)
            expect(parsed.multipleRelation.rules?.eachType).toBe(ObjectId)
            expect(parsed.multipleRelation.rules?.custom).toBeDefined()
        })

        it('should default to ObjectId when relationAsObjectId option is not provided', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'defaultRelation',
                        type: 'relation',
                        title: 'Default Relation',
                        specs: {
                            collection: 'users',
                            multiple: false,
                            mayBeEmpty: true,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

            // Should default to ObjectId (backend mode)
            expect(parsed.defaultRelation.type).toBe(ObjectId)
        })

        it('should handle required single relation as ObjectId', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'requiredRelation',
                        type: 'relation',
                        title: 'Required Relation',
                        specs: {
                            collection: 'organizations',
                            multiple: false,
                            mayBeEmpty: false,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: true }) as any;

            expect(parsed.requiredRelation.type).toBe(ObjectId)
            expect(parsed.requiredRelation.rules.custom).toBeDefined()
        })

        it('should handle required multiple relation as ObjectId array', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'requiredTags',
                        type: 'relation',
                        title: 'Required Tags',
                        specs: {
                            collection: 'tags',
                            multiple: true,
                            mayBeEmpty: false,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: true }) as any;

            expect(parsed.requiredTags.type).toBe(Array)
            expect(parsed.requiredTags.rules?.eachType).toBe(ObjectId)
            expect(parsed.requiredTags.rules?.custom).toBeDefined()
        })
    })

    describe('relationAsObjectId option set to false (frontend mode)', () => {
        it('should parse single relation as String when relationAsObjectId is false', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'singleRelation',
                        type: 'relation',
                        title: 'Single Relation',
                        specs: {
                            collection: 'users',
                            multiple: false,
                            mayBeEmpty: true,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

            expect(parsed.singleRelation.type).toBe(String)
            expect(parsed.singleRelation.rules).toBeDefined()
            expect(parsed.singleRelation.rules.custom).toBeDefined()
        })

        it('should parse multiple relation with String eachType when relationAsObjectId is false', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'multipleRelation',
                        type: 'relation',
                        title: 'Multiple Relation',
                        specs: {
                            collection: 'tags',
                            multiple: true,
                            mayBeEmpty: true,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

            expect(parsed.multipleRelation.type).toBe(Array)
            expect(parsed.multipleRelation.rules?.eachType).toBe(String)
            expect(parsed.multipleRelation.rules?.custom).toBeDefined()
        })

        it('should handle required single relation as String', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'requiredRelation',
                        type: 'relation',
                        title: 'Required Relation',
                        specs: {
                            collection: 'organizations',
                            multiple: false,
                            mayBeEmpty: false,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

            expect(parsed.requiredRelation.type).toBe(String)
            expect(parsed.requiredRelation.rules.custom).toBeDefined()
        })

        it('should handle required multiple relation as String array', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'requiredTags',
                        type: 'relation',
                        title: 'Required Tags',
                        specs: {
                            collection: 'tags',
                            multiple: true,
                            mayBeEmpty: false,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

            expect(parsed.requiredTags.type).toBe(Array)
            expect(parsed.requiredTags.rules?.eachType).toBe(String)
            expect(parsed.requiredTags.rules?.custom).toBeDefined()
        })

        it('should handle optional multiple relation as String array', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'optionalTags',
                        type: 'relation',
                        title: 'Optional Tags',
                        specs: {
                            collection: 'tags',
                            multiple: true,
                            mayBeEmpty: true,
                        }
                    }
                },
            ]

            const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;

            expect(parsed.optionalTags.type).toBe(Array)
            expect(parsed.optionalTags.rules?.eachType).toBe(String)
            expect(parsed.optionalTags.rules?.custom).toBeDefined()
        })
    })

    describe('validation consistency across modes', () => {
        it('should validate 24-character IDs correctly in both String and ObjectId modes', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'singleRelation',
                        type: 'relation',
                        title: 'Single Relation',
                        specs: {
                            collection: 'users',
                            multiple: false,
                            mayBeEmpty: true,
                        }
                    }
                },
            ]

            const parsedAsString = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;
            const parsedAsObjectId = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: true }) as any;

            const validatorString = parsedAsString.singleRelation.rules?.custom
            const validatorObjectId = parsedAsObjectId.singleRelation.rules?.custom

            const validId = '507f1f77bcf86cd799439011'
            const invalidId = 'short'

            // Both modes should accept valid 24-char IDs
            expect(validatorString(validId, {}).result).toBe(true)
            expect(validatorObjectId(validId, {}).result).toBe(true)

            // Both modes should reject invalid IDs
            expect(validatorString(invalidId, {}).result).toBe(false)
            expect(validatorObjectId(invalidId, {}).result).toBe(false)
        })

        it('should validate multiple relations consistently in both modes', () => {
            const kodzeroSchema: TableField<TableFieldAny>[] = [
                {
                    id: 'xxx',
                    order: 1,
                    isAuto: false,
                    item: {
                        key: 'multipleRelation',
                        type: 'relation',
                        title: 'Multiple Relation',
                        specs: {
                            collection: 'tags',
                            multiple: true,
                            mayBeEmpty: true,
                        }
                    }
                },
            ]

            const parsedAsString = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: false }) as any;
            const parsedAsObjectId = KodzeroToValidnoParser.parseSchema(kodzeroSchema, { relationAsObjectId: true }) as any;

            const validatorString = parsedAsString.multipleRelation.rules?.custom
            const validatorObjectId = parsedAsObjectId.multipleRelation.rules?.custom

            const validIds = ['507f1f77bcf86cd799439011', '507f191e810c19729de860ea']
            const invalidIds = ['507f1f77bcf86cd799439011', 'short']

            // Both modes should accept valid IDs
            expect(validatorString(validIds, {}).result).toBe(true)
            expect(validatorObjectId(validIds, {}).result).toBe(true)

            // Both modes should reject arrays with invalid IDs
            expect(validatorString(invalidIds, {}).result).toBe(false)
            expect(validatorObjectId(invalidIds, {}).result).toBe(false)

            // Both modes should allow empty arrays when mayBeEmpty is true
            expect(validatorString([], {}).result).toBe(true)
            expect(validatorObjectId([], {}).result).toBe(true)
        })
    })
})
