<script setup lang="ts">
import { computed, ref, useAttrs } from "vue"
import { isNotEmpty } from '@primeuix/utils/object'

const props = withDefaults(defineProps<{
  inputId: string
  allowEmpty?: boolean

  disabled?: boolean
  readonly?: boolean
  placeholder?: string

  min?: number
  max?: number

  locale?: string
  localeMatcher?: string
  mode?: string
  currency?: string
  currencyDisplay?: string
  useGrouping?: boolean
  minFractionDigits?: number
  maxFractionDigits?: number
}>(), {
  allowEmpty: true,

  disabled: false,
  readonly: false,
  placeholder: '',

  locale: 'ko-KR',
  localeMatcher: undefined,
  mode: 'decimal',
  style: undefined,
  currency: undefined,
  currencyDisplay: undefined,
  useGrouping: true
})

const emit = defineEmits<{
  input: [payload: { originalEvent: Event, value: string, formattedValue: string }]
  focus: []
  blur: []
}>()

const inputRef = ref()
// TODO :: 타입에 대한 고민 필요. (문자형, 숫자형)
const digitValue = defineModel<string|null>( {default: ''})

const attrs = useAttrs()

function getNumberFormatOptions() {
  return {
    localeMatcher: props.localeMatcher,
    style: props.mode,
    currency: props.currency,
    currencyDisplay: props.currencyDisplay,
    useGrouping: props.useGrouping,
    minimumFractionDigits: props.minFractionDigits,
    maximumFractionDigits: props.maxFractionDigits,
  } as Intl.NumberFormatOptions
}

// NumberFormat 구성
const numberFormat = new Intl.NumberFormat(props.locale, getNumberFormatOptions())
const numerals = [...new Intl.NumberFormat(props.locale, { useGrouping: false }).format(9876543210)].reverse();
const index = new Map(numerals.map((d, i) => [d, i]));

const _numeral = new RegExp(`[${numerals.join('')}]`, 'g');
let groupChar = ''
const _group = getGroupingExpression()
const _minusSign = getMinusSignExpression()
const _currency = getCurrencyExpression();
const _decimal = getDecimalExpression();
const _index = (d: string) => index.get(d);

// 마지막 입력 값
let lastValue: string|null = null
let isSpecialChar: boolean = false

// 소수점 표현식
function getDecimalExpression() {
  const formatter = new Intl.NumberFormat(props.locale, { ...getNumberFormatOptions(), useGrouping: false });

  return new RegExp(`[${formatter.format(1.1).replace(_currency, '').trim().replace(_numeral, '')}]`, 'g');
}

// 그룹핑 표현식
function getGroupingExpression() {
  const formatter = new Intl.NumberFormat(props.locale, { useGrouping: true });

  groupChar = formatter.format(1000000).trim().replace(_numeral, '').charAt(0);

  return new RegExp(`[${groupChar}]`, 'g');
}

// 음수 표현식
function getMinusSignExpression() {
  const formatter = new Intl.NumberFormat(props.locale, { useGrouping: false });

  return new RegExp(`[${formatter.format(-1).trim().replace(_numeral, '')}]`, 'g');
}

// 통화 표현식
function getCurrencyExpression() {
  if (props.currency) {
    const formatter = new Intl.NumberFormat(props.locale, {
      style: 'currency',
      currency: props.currency,
      currencyDisplay: props.currencyDisplay,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    } as Intl.NumberFormatOptions)

    return new RegExp(`[${formatter.format(1).replace(/\s/g, '').replace(_numeral, '').replace(_group, '')}]`, 'g');
  }

  return new RegExp(`[]`, 'g');
}

/**
 * 문자열 포맷팅
 */
function formatValue(value: string|null): string {
  if(value != null) {
    if (value === '-') {
      return value
    }

    const parseValue = Number(value)
    if(isNaN(parseValue)) {
      throw new Error('숫자로 변환할 수 없는 값입니다.')
    }

    return numberFormat.format(parseValue)
  }

  return ''
}

function parseValue(value: string|null) {
  if(value == null) return null

  let filteredText = value.trim()
      .replace(/\s/g, '')
      .replace(_currency, '')
      .replace(_group, '')
      .replace(_minusSign, '-')
      .replace(_decimal, '.')
      // @ts-ignore
      .replace(_numeral, _index);

  if (filteredText) {
    if (filteredText === '-') return filteredText

    return isNaN(Number(filteredText)) ? null : filteredText
  }

  return null
}

function validateValue(value: string | null) {
  // @ts-ignore
  if (value === '-' || value == null) {
    return null;
  }

  if (props.min != null) {
    const _value = Number(value)
    if (_value < props.min) {
      return props.min.toString();
    }
  }

  if (props.max != null) {
    const _value = Number(value)
    if (_value > props.max) {
      return props.max.toString();
    }
  }

  return value;
}

function updateInput(value: string, insertedValueStr: string, operation: string, valueStr: string) {
  insertedValueStr = insertedValueStr || '';

  let inputValue = inputRef.value.value;
  let newValue = formatValue(value);
  let currentLength = inputValue.length;

  if (newValue !== valueStr) {
    newValue = concatValues(newValue, valueStr);
  }

  if (currentLength === 0) {
    inputRef.value.value = newValue;
    inputRef.value.setSelectionRange(0, 0);
    const index = initCursor();
    const selectionEnd = index + insertedValueStr.length;

    inputRef.value.setSelectionRange(selectionEnd, selectionEnd);
  } else {
    let selectionStart = inputRef.value.selectionStart;
    let selectionEnd = inputRef.value.selectionEnd;

    inputRef.value.value = newValue;
    let newLength = newValue.length;

    if (operation === 'range-insert') {
      const startValue = parseValue((inputValue || '').slice(0, selectionStart));
      const startValueStr = startValue !== null ? startValue.toString() : '';
      const startExpr = startValueStr.split('').join(`(${groupChar})?`);
      const sRegex = new RegExp(startExpr, 'g');

      sRegex.test(newValue);

      const tExpr = insertedValueStr.split('').join(`(${groupChar})?`);
      const tRegex = new RegExp(tExpr, 'g');

      tRegex.test(newValue.slice(sRegex.lastIndex));

      selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
      inputRef.value.setSelectionRange(selectionEnd, selectionEnd);
    } else if (newLength === currentLength) {
      if (operation === 'insert' || operation === 'delete-back-single') {
        inputRef.value.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
      } else if (operation === 'delete-single') {
        inputRef.value.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
      } else if (operation === 'delete-range' || operation === 'spin') {
        inputRef.value.setSelectionRange(selectionEnd, selectionEnd);
      }
    } else if (operation === 'delete-back-single') {
      let prevChar = inputValue.charAt(selectionEnd - 1);
      let nextChar = inputValue.charAt(selectionEnd);
      let diff = currentLength - newLength;
      let isGroupChar = _group.test(nextChar);

      if (isGroupChar && diff === 1) {
        selectionEnd += 1;
      } else if (!isGroupChar && isNumeralChar(prevChar)) {
        selectionEnd += -1 * diff + 1;
      }

      _group.lastIndex = 0;
      inputRef.value.setSelectionRange(selectionEnd, selectionEnd);
    } else if (inputValue === '-' && operation === 'insert') {
      inputRef.value.setSelectionRange(0, 0);
      const index = initCursor();
      const selectionEnd = index + insertedValueStr.length + 1;

      inputRef.value.setSelectionRange(selectionEnd, selectionEnd);
    } else {
      selectionEnd = selectionEnd + (newLength - currentLength);
      inputRef.value.setSelectionRange(selectionEnd, selectionEnd);
    }
  }

  // inputRef.value.setAttribute('aria-valuenow', value);
}

function onUserInput() {
  // TODO :: 유지할지 고민해보자
  if(isSpecialChar) {
    inputRef.value.value = lastValue
  }

  isSpecialChar = false
}

function onInputKeyDown(event: KeyboardEvent) {
  console.log(event)

  if (props.readonly) return

  // 특수키 사용 시 값 유지
  if(event.altKey || event.ctrlKey || event.metaKey) {
    isSpecialChar = true
    lastValue = inputRef.value.value

    return
  }

  // @ts-ignore
  lastValue = event.target?.value

  // @ts-ignore
  let selectionStart = event.target?.selectionStart;
  // @ts-ignore
  let selectionEnd = event.target?.selectionEnd;
  let selectionRange = selectionEnd - selectionStart;
  // @ts-ignore
  let inputValue: string = event.target.value;
  let newValueStr = null;
  const code = event.code || event.key;

  switch (code) {

    case 'ArrowLeft':
      if (selectionRange > 1) {
        const cursorPosition = isNumeralChar(inputValue.charAt(selectionStart)) ? selectionStart + 1 : selectionStart + 2

        inputRef.value.setSelectionRange(cursorPosition, cursorPosition)
      } else if (!isNumeralChar(inputValue.charAt(selectionStart - 1))) {
        event.preventDefault()
      }
      break

    case 'ArrowRight':
      if (selectionRange > 1) {
        const cursorPosition = selectionEnd + 1

        inputRef.value.setSelectionRange(cursorPosition, cursorPosition)
      } else if (!isNumeralChar(inputValue.charAt(selectionStart))) {
        event.preventDefault()
      }
      break

    case 'Tab':
    case 'Enter':
    case 'NumpadEnter':
      newValueStr = validateValue(parseValue(inputValue))
      inputRef.value.value = formatValue(newValueStr)

      updateModel(event, newValueStr)
      break
    case 'Backspace':
      event.preventDefault()

      if (selectionStart === selectionEnd) {
        const deleteChar = inputValue.charAt(selectionStart - 1);
        const { decimalCharIndex, decimalCharIndexWithoutPrefix } = getDecimalCharIndexes(inputValue);

        if (isNumeralChar(deleteChar)) {
          const decimalLength = getDecimalLength(inputValue);

          if (_group.test(deleteChar)) {
            _group.lastIndex = 0;
            newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
          } else if (_decimal.test(deleteChar)) {
            _decimal.lastIndex = 0;

            if (decimalLength) {
              inputRef.value.setSelectionRange(selectionStart - 1, selectionStart - 1);
            } else {
              newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
            }
          } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
            const insertedText = isDecimalMode() && (props.minFractionDigits || 0) < decimalLength ? '' : '0';

            newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
          } else if (decimalCharIndexWithoutPrefix === 1) {
            newValueStr = inputValue.slice(0, selectionStart - 1) + '0' + inputValue.slice(selectionStart);
            // @ts-ignore
            newValueStr = parseValue(newValueStr) > 0 ? newValueStr : '';
          } else {
            newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
          }
        }

        // @ts-ignore
        updateValue(event, newValueStr, null, 'delete-single');
      } else {
        newValueStr = deleteRange(inputValue, selectionStart, selectionEnd);
        // @ts-ignore
        updateValue(event, newValueStr, null, 'delete-range');
      }

      break

    case 'Delete':
      event.preventDefault()
      // TODO ::
      break

    case 'Home':
      event.preventDefault()

      if (isNotEmpty(props.min)) {
        // @ts-ignore
        updateModel(event, props.min);
      }
      break
    case 'End':
      event.preventDefault()

      if (isNotEmpty(props.max)) {
        // @ts-ignore
        updateModel(event, props.max);
      }

      break
    default:
      break
  }

  // console.log('selectionStart : ', selectionStart)
  // console.log('selectionEnd : ', selectionEnd)
  // console.log('selectionRange : ', selectionRange)
  // console.log('inputValue : ', inputValue)
  // console.log('code : ', code)
}

function concatValues(val1: string, val2: string) {
  if (val1 && val2) {
    let decimalCharIndex = val2.search(_decimal);

    _decimal.lastIndex = 0;
    return decimalCharIndex !== -1 ? val1.split(_decimal)[0] + val2.slice(decimalCharIndex) : val1;
  }

  return val1;
}

function getDecimalLength(value: string) {
  if (value) {
    const valueSplit = value.split(_decimal);

    if (valueSplit.length === 2) {
      return valueSplit[1].trim().replace(/\s/g, '').length
    }
  }

  return 0;
}

function updateModel(event: Event, value: string|null) {
  // TODO :: model 업데이트

  digitValue.value = value
  inputRef.value.onChange?.({ originalEvent: event, value })
}

const formattedValue = computed(() => {
  const val = !digitValue.value && !props.allowEmpty ? '0' : digitValue.value

  return formatValue(val)
})

function deleteRange(value: string, start: number, end: number) {
  let newValueStr;

  if (end - start === value.length) newValueStr = '';
  else if (start === 0) newValueStr = value.slice(end);
  else if (end === value.length) newValueStr = value.slice(0, start);
  else newValueStr = value.slice(0, start) + value.slice(end);

  return newValueStr;
}

function initCursor() {
  let selectionStart = inputRef.value.selectionStart;
  let inputValue = inputRef.value.value;
  let valueLength = inputValue.length;
  let index = null;

  let char = inputValue.charAt(selectionStart);

  //left
  let i = selectionStart - 1;

  while (i >= 0) {
    char = inputValue.charAt(i);

    if (isNumeralChar(char)) {
      index = i
      break
    } else {
      i--
    }
  }

  if (index !== null) {
    inputRef.value.setSelectionRange(index + 1, index + 1);
  } else {
    i = selectionStart;

    while (i < valueLength) {
      char = inputValue.charAt(i);

      if (isNumeralChar(char)) {
        index = i
        break;
      } else {
        i++;
      }
    }

    if (index !== null) {
      inputRef.value.setSelectionRange(index, index);
    }
  }

  return index || 0;
}

function isNumeralChar(char: string) {
  if (char.length === 1 && (_numeral.test(char) || _decimal.test(char) || _group.test(char) || _minusSign.test(char))) {
    resetRegex();

    return true;
  }

  return false;
}

function isDecimalMode() {
  return props.mode === 'decimal'
}

function getDecimalCharIndexes(val: string) {
  let decimalCharIndex = val.search(_decimal)

  _decimal.lastIndex = 0

  const filteredVal = val.trim().replace(/\s/g, '')
  const decimalCharIndexWithoutPrefix = filteredVal.search(_decimal)

  _decimal.lastIndex = 0

  return { decimalCharIndex, decimalCharIndexWithoutPrefix }
}

function resetRegex() {
  _numeral.lastIndex = 0
  _decimal.lastIndex = 0
  _group.lastIndex = 0
  _minusSign.lastIndex = 0
}

function updateValue(event: Event, valueStr: string, insertedValueStr: string, operation: string) {
  let currentValue = inputRef.value.value
  let newValue = null

  if (valueStr != null) {
    newValue = parseValue(valueStr)
    newValue = !newValue && !props.allowEmpty ? 0 : newValue

    // @ts-ignore
    updateInput(newValue, insertedValueStr, operation, valueStr)
    // @ts-ignore
    handleOnInput(event, currentValue, newValue)
  }
}

function handleOnInput(event: Event, currentValue: string, newValue: string) {
  if(isValueChanged(currentValue, newValue)) {
    emit('input', { originalEvent: event, value: newValue, formattedValue: currentValue })
    inputRef.value.onInput?.({ originalEvent: event, value: newValue })
  }
}

function isValueChanged(currentValue: string, newValue: string) {
  if (newValue === null && currentValue !== null) {
    return true;
  }

  if (newValue != null) {
    let parsedCurrentValue = parseValue(currentValue)

    return newValue !== parsedCurrentValue;
  }

  return false;
}
</script>

<template>
  <div>
    <!-- TODO :: 이벤트 등록 -->
    <input
      type="text"
      :id="inputId"
      v-bind="attrs"

      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"

      @input="onUserInput"
      @keydown="onInputKeyDown"
      @paste=""
      @click=""
      @focus=""
      @blur=""

      ref="inputRef"
    />
  </div>
</template>

