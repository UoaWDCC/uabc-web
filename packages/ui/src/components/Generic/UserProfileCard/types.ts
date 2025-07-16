import type { InputType } from "@repo/ui/components/Primitive"
import type { SelectItem } from "@yamada-ui/react"

/**
 * FieldType represents the type of a form field.
 */
export type FieldType = "text" | "select" | "multiselect"

/**
 * Base interface for all field types.
 *
 * @template K The key type for the field.
 * @property key Unique key for the field.
 * @property label Display label for the field.
 * @property placeholder Optional placeholder text.
 * @property required Whether the field is required.
 * @property disabled Whether the field is disabled.
 */
export interface BaseField<K extends string = string> {
  readonly key: K
  readonly label: string
  readonly placeholder?: string
  readonly required?: boolean
  readonly disabled?: boolean
}

/**
 * Text field definition.
 *
 * @template K The key type for the field.
 * @property type Always 'text'.
 * @property inputType Optional input type (e.g., text, email, tel).
 */
export interface TextField<K extends string = string> extends BaseField<K> {
  readonly type: "text"
  readonly inputType?: InputType
}

/**
 * Select field definition.
 *
 * @template K The key type for the field.
 * @property type Always 'select'.
 * @property items The selectable items.
 */
export interface SelectField<K extends string = string> extends BaseField<K> {
  readonly type: "select"
  readonly items: readonly SelectItem[]
}

/**
 * Multi-select field definition.
 *
 * @template K The key type for the field.
 * @property type Always 'multiselect'.
 * @property items The selectable items.
 */
export interface MultiSelectField<K extends string = string> extends BaseField<K> {
  readonly type: "multiselect"
  readonly items: readonly SelectItem[]
}

/**
 * Field represents any supported field type.
 *
 * @template K The key type for the field.
 */
export type Field<K extends string = string> = TextField<K> | SelectField<K> | MultiSelectField<K>

/**
 * Fields is a tuple of Field definitions.
 *
 * @template T The tuple of fields.
 */
export type Fields<T extends readonly Field[]> = T

/**
 * FormData maps field keys to their values, handling multiselect as string[] and others as string.
 *
 * @template T The tuple of fields.
 */
export type FormData<T extends readonly Field[]> = {
  [K in T[number]["key"]]: Extract<T[number], { key: K }> extends { type: "multiselect" }
    ? string[]
    : string
}

/**
 * NullableFormData maps field keys to their values, allowing null for non-required fields.
 * For multiselect: string[] | null | undefined if not required, string[] if required.
 * For others: string | null | undefined if not required, string if required.
 *
 * @template T The tuple of fields.
 */
export type NullableFormData<T extends readonly Field[]> = {
  [K in T[number]["key"]]: Extract<T[number], { key: K }> extends { type: "multiselect" }
    ? Extract<T[number], { key: K }> extends { required: true }
      ? string[]
      : string[] | null | undefined
    : Extract<T[number], { key: K }> extends { required: true }
      ? string
      : string | null | undefined
}
