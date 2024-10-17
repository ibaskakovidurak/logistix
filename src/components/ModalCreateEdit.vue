<template>
  <v-dialog
    v-model="modalEditCreate"
    max-width="600"
  >
    <v-card
      :title="requestType === 'create'
      ? 'Создать заказ'
      : 'Обновить заказ'
    ">
      <v-form fast-fail @submit.stop.prevent="submit" ref="formValidate">
        <v-card-text>
          <v-row dense>
            <v-col
              v-for="(field, key) in fields"
              cols="12"
              sm="12"
              :key="key"
            >
              <v-text-field
                v-if="field.key !== 'order_id'"
                v-model="form[field.key]"
                :type="field.type"
                :label="field.title"
                :rules="rules[field.type]"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-divider class="mt-2" />
          <v-card-actions class="my-2 justify-end">
            <v-btn
                text="Закрыть"
                @click="$emit('close')"
            />
            <v-btn
                type="submit"
                text="Сохранить"
                color="primary"
                variant="flat"
            />
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref, type Ref} from 'vue'
import rules from '@/utils/form/rules'
import apiServices from "@/services/api/apiServices";

const props = defineProps<{
  fields: Array<{ type: string, key: string, title: string }>,
  requestType: string,
  data?: Object
}>()

const emits = defineEmits<{
  (e: 'error', notification: any): void
  (e: 'success', notification: any): void
  (e: 'close'): void
}>()

const modalEditCreate: Ref<any> = ref(true)
const formValidate: Ref<any> = ref()
const requestType: Ref<any> = ref(props.requestType)
const form: Ref<any> = ref(props.requestType === 'update'
    ? props.data
    : props.fields.reduce((acc: any, cur: any) => {
      acc[cur.key] = cur.type === 'number' ? 0 : ''
      return acc
    }, {})
)



/**
 * Create Order
 *
 * @function
 * @async
 * @return Promise<any>
 */
const createOrder = async (): Promise<any> => {
  const prepareFields = {
    order_date: form.value.order_date,
    order_num: form.value.order_num,
    order_amount: Number(form.value.order_amount),
  }
  const request = await apiServices.createOrder(null, prepareFields)

  if (request.status !== 200) {
    emits('error', request.data)
    return
  }

  emits('success', {
    type: request.status,
    message: 'Новый заказ успешно создан!'
  })

}


/**
 * Update Order
 *
 * @function
 * @async
 * @return Promise<Object>
 */
const updateOrder = async (): Promise<any> => {
  const prepareFields = {
    order_date: form.value.order_date,
    order_num: form.value.order_num,
    order_amount: Number(form.value.order_amount),
  }
  const request = await apiServices.updateOrder({ id: form.value.order_id }, prepareFields)

  if (request.status !== 200) {
    emits('error', request.data)
    return
  }

  emits('success', {
    type: request.status,
    message: `Заказ#${form.value.order_id} успешно обновлен!`
  })
}


/**
 * Check & submit form
 *
 * @function
 * @async
 * @retun Promise<void>
 */
const submit = async (): Promise<void> => {
  const validate = await formValidate.value?.validate()

  if (validate.valid) {
    requestType.value === 'create'
      ? await createOrder()
      : await updateOrder()
  }
}
</script>