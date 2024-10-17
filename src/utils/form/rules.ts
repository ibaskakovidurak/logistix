/**
 * Simple rules for the form (for example)
 *
 * @return Object
 */
const rules: any = {
    text: [
        (value: any) => {
            if (value?.length >= 3) return true

            return 'Длинна поля должна быть не менее 3-х символов'
        },
    ],
    date: [
        (value: any) => {
            if (Date.parse(value)) return true

            return 'Поле должно быть датой'
        },
    ]
}

export default rules