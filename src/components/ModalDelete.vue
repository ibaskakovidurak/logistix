<template>
  <v-dialog
    v-model="modalDelete"
    max-width="500"
  >
    <v-card title="Удаление заказа">
      <v-card-text>
        Вы уверены, что хотите удалить заказ?
      </v-card-text>
      <v-divider class="mt-2" />
      <v-card-actions class="my-2">
        <v-btn
          text="Закрыть"
          @click="$emit('close')"
        />
        <v-btn
          text="Удалить"
          color="primary"
          variant="flat"
          @click="deleteOrder"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref, type Ref} from 'vue'
import apiServices from "@/services/api/apiServices";


const props = defineProps<{
  orderId: Number
}>()

const emits = defineEmits<{
  (e: 'error', notification: any): void
  (e: 'success', notification: any): void
  (e: 'close'): void
}>()

const modalDelete: Ref<boolean> = ref(true)


/**
 * Delete Order
 *
 * @function
 * @async
 * @return Promise<void>
 */
const deleteOrder = async (): Promise<void>  => {
  const request = await apiServices.deleteOrder({id: props.orderId})

  if (request.status !== 200) {
    emits('error', request.data)
    return
  }

  emits('success', {
    type: request.status,
    message: 'Заказ был успешно удален!'
  })
}
</script>