import Schema from "validno";

import { booleanSpecsSchema } from "./types-constructors/boolean.js";
import { dateSpecsSchema } from "./types-constructors/date.js";
import { emailSpecsSchema } from "./types-constructors/email.js";
import { stringSpecsSchema } from "./types-constructors/string.js";
import { jsonSpecsSchema } from "./types-constructors/json.js";
import { numberSpecsSchema } from "./types-constructors/number.js";
import { selectSpecsSchema } from "./types-constructors/select.js";
import { urlSpecsSchema } from "./types-constructors/url.js";
import { TableField, TableFieldAny } from "./types.js";
import { relationSpecsSchema } from "./types-constructors/relation.js";
import { markdownSpecsSchema } from "./types-constructors/markdown.js";

const Checks: Record<string, {description: string, error: string}> = {
    'ok': {
        description: 'Summary of validations',
        error: 'Field is invalid'
    },
    'unique': {
        description: 'Enserues that key name is unique across the schema',
        error: 'Field key is not unique'
    },
    'wrapper': {
        description: 'Validates field wrapper',
        error: 'Field wrapper failed validation'
    },
    'base': {
        description: 'Validates base field parameters',
        error: 'Base settings failed validation'
    },
    'specs': {
        description: 'Validates type-specific field parameters',
        error: 'Specifications failed validation'
    }
}

const getCheckErrorText = (checkId: string) => {
    return Checks[checkId].error
}

const baseSchema = new Schema({
    key: { type: String },
    type: { type: String },
    title: { type: String },
})

const wrapperSchema = new Schema({
    id: { type: String },
    order: { type: Number },
    isAuto: { type: Boolean, required: false },
    item: { type: Object },
})

const handleKey = (field: TableField<TableFieldAny>, allKeys: string[]) => {
    const output: Record<string, boolean> = {}
    const keyName = field.item.key

    const isUnique = allKeys.filter(k => k === keyName).length === 1
    const wrapperResult = FieldValidator.validateWrapper(field)
    const baseResult = FieldValidator.validateBase(field.item)
    const specsResult = FieldValidator.validateSpecsAuto(field.item.type, field.item.specs)
    
    output['unique'] = isUnique
    output['wrapper'] = wrapperResult.ok || false;
    output['base'] = baseResult.ok || false;
    output['specs'] = specsResult.ok || false;
    output['ok'] = [
        isUnique,
        wrapperResult.ok,
        baseResult.ok,
        specsResult.ok
    ].every(el => el === true)

    return output
}

const getFinalResult = (results: Record<string, {ok: boolean}>) => {
    const errors: Record<string, any> = {}
    let errorsString = ''

    for (const [key, result] of Object.entries(results)) {
        if (!result.ok) {
            const failed = Object.entries(result)
                .filter(([k, v]) => k !== 'ok' && v === false)
                .map(([k]) => getCheckErrorText(k));

            if (failed.length) {
                errors[key] = failed;
                errorsString += `"${key}": ${failed.join(',')};`
            }
        }
    }

    const finalResult = {
        ok: !Object.keys(errors).length,
        errors,
        errorsString
    }

    return finalResult
}

class FieldValidator {
    constructor() {}

    static validateString(input: Record<string, any>) {
        return stringSpecsSchema.validate(input);
    }

    static validateBoolean(input: Record<string, any>) {
        return booleanSpecsSchema.validate(input);
    }

    static validateDate(input: Record<string, any>) {
        return dateSpecsSchema.validate(input);
    }

    static validateEmail(input: Record<string, any>) {
        return emailSpecsSchema.validate(input);
    }

    static validateJson(input: Record<string, any>) {
        return jsonSpecsSchema.validate(input);
    }

    static validateNumber(input: Record<string, any>) {
        return numberSpecsSchema.validate(input);
    }

    static validateSelect(input: Record<string, any>) {
        return selectSpecsSchema.validate(input);
    }

    static validateUrl(input: Record<string, any>) {
        return urlSpecsSchema.validate(input);
    }

    static validateRelation(input: Record<string, any>) {
        return relationSpecsSchema.validate(input);
    }

    static validateMarkdown(input: Record<string, any>) {
        return markdownSpecsSchema.validate(input);
    }

    static validateBase(input: Record<string, any>) {
        return baseSchema.validate(input);
    }

    static validateWrapper(input: Record<string, any>) {
        return wrapperSchema.validate(input);
    }

    static validateSpecsAuto(type: string, specs: Record<string, any>) {
        switch (String(type)) {
            case 'boolean':
                return this.validateBoolean(specs);
            case 'date':
                return this.validateDate(specs);
            case 'email':
                return this.validateEmail(specs);
            case 'json':
                return this.validateJson(specs);
            case 'markdown':
                return this.validateMarkdown(specs);
            case 'number':
                return this.validateNumber(specs);
            case 'relation':
                return this.validateRelation(specs);
            case 'select':
                return this.validateSelect(specs);
            case 'string':
                return this.validateString(specs);
            case 'url':
                return this.validateUrl(specs);
            default:
                throw new Error(`Unknown field type: ${type}`);
        }
    }

    static validateAllFields(fields: TableField<TableFieldAny>[]) {
        const results: Record<string, any> = {};
        const allKeys = fields.map((field) => field.item.key)

        fields.forEach((field) => results[field.item.key] = handleKey(field, allKeys));
        const finalResult = getFinalResult(results);

        if (!finalResult.ok) {
            const err = new Error(`Schema validation failed. ${finalResult.errorsString}`)
            // @ts-ignore // TODO: ApiError or Error w code
            err.code = 400;
            throw err
        }

        return true;
    }
}

export default FieldValidator;