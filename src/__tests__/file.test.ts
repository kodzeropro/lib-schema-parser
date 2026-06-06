import { describe, it, expect } from '@jest/globals';
import KodzeroToValidnoParser from '../KodzeroToValidnoParser.js';
import { TableField, TableFieldAny } from '../kz-schema-factory/types.js';

describe('KodzeroToValidnoParser: file', () => {
    it('should parse basic file field without extra rules', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'avatar',
                    type: 'file',
                    title: 'Avatar',
                    specs: {
                        multiple: false,
                        maxSize: 0,
                        mayBeEmpty: true,
                        allowedMimeTypes: [],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.avatar.type).toBe(Object)
        expect(typeof parsed.avatar.rules?.custom).toBe('function')

        const customValidator = parsed.avatar.rules?.custom as Function;
        const validResult = customValidator(
            { path: '/uploads/avatar.png', name: 'avatar.png', mimeType: 'image/png', size: 90 },
            {},
        );

        expect(validResult.result).toBe(true)
        expect(validResult.details).toBe('')
    })

    it('should parse required file field', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'document',
                    type: 'file',
                    title: 'Document',
                    specs: {
                        multiple: false,
                        maxSize: 0,
                        mayBeEmpty: false,
                        allowedMimeTypes: [],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(typeof parsed.document).toBe('object')
        expect(parsed.document.rules?.isNot).toBe(null)
        expect(typeof parsed.document.rules?.custom).toBe('function')
    })

    it('should parse multiple files field', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'attachments',
                    type: 'file',
                    title: 'Attachments',
                    specs: {
                        multiple: true,
                        maxSize: 0,
                        mayBeEmpty: true,
                        allowedMimeTypes: [],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.attachments.type).toBe(Array)
        expect(parsed.attachments.rules?.eachType).toBeUndefined()
        expect(typeof parsed.attachments.rules?.custom).toBe('function')
    })

    it('should enforce max size and mime type with custom validator', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'report',
                    type: 'file',
                    title: 'Report',
                    specs: {
                        multiple: false,
                        maxSize: 100,
                        mayBeEmpty: false,
                        allowedMimeTypes: ['application/pdf'],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(typeof parsed.report).toBe('object')
        expect(parsed.report.rules?.isNot).toBe(null)
        expect(typeof parsed.report.rules?.custom).toBe('function')

        const customValidator = parsed.report.rules?.custom as Function;

        const validResult = customValidator(
            { path: '/uploads/report.pdf', name: 'report.pdf', mimeType: 'application/pdf', size: 90 },
            {},
        );

        const invalidResult = customValidator(
            { path: '/uploads/report.png', name: 'report.png', mimeType: 'image/png', size: 120 },
            {},
        );

        expect(validResult.result).toBe(true)
        expect(validResult.details).toBe('')
        expect(invalidResult.result).toBe(false)
        expect(invalidResult.details).toBe('File is invalid')
    })

    it('should validate each file for multiple field', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'gallery',
                    type: 'file',
                    title: 'Gallery',
                    specs: {
                        multiple: true,
                        maxSize: 500,
                        mayBeEmpty: false,
                        allowedMimeTypes: ['image/png', 'image/jpeg'],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;

        expect(parsed.gallery.type).toBe(Array)
        expect(parsed.gallery.rules?.eachType).toBeUndefined()
        expect(parsed.gallery.rules?.lengthNot).toBe(0)
        expect(typeof parsed.gallery.rules?.custom).toBe('function')

        const customValidator = parsed.gallery.rules?.custom as Function;

        const validResult = customValidator(
            [
                { path: '/uploads/1.png', name: '1.png', mimeType: 'image/png', size: 100 },
                { path: '/uploads/2.jpg', name: '2.jpg', mimeType: 'image/jpeg', size: 300 },
            ],
            {},
        );

        const invalidResult = customValidator(
            [
                { path: '/uploads/1.png', name: '1.png', mimeType: 'image/png', size: 100 },
                { path: '/uploads/2.pdf', name: '2.pdf', mimeType: 'application/pdf', size: 100 },
            ],
            {},
        );

        expect(validResult.result).toBe(true)
        expect(validResult.details).toBe('')
        expect(invalidResult.result).toBe(false)
        expect(invalidResult.details).toBe('One or more files are invalid')
    })

    it('should reject file object with invalid shape', () => {
        const kodzeroSchema: TableField<TableFieldAny>[] = [
            {
                id: 'xxx',
                order: 1,
                isAuto: false,
                item: {
                    key: 'attachment',
                    type: 'file',
                    title: 'Attachment',
                    specs: {
                        multiple: false,
                        maxSize: 1,
                        mayBeEmpty: true,
                        allowedMimeTypes: [],
                    }
                }
            },
        ]

        const parsed = KodzeroToValidnoParser.parseSchema(kodzeroSchema) as any;
        expect(typeof parsed.attachment.rules?.custom).toBe('function')

        const customValidator = parsed.attachment.rules?.custom as Function;
        const invalidResult = customValidator({ mimeType: 'image/png', size: 100 }, {});

        expect(invalidResult.result).toBe(false)
        expect(invalidResult.details).toBe('Invalid file value')
    })
})
