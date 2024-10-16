<template>
  <v-card
    :title="title"
    flat
  >
    <div class="mb-4 mt-4">
      <v-btn
        :disabled="loading"
        text="Добавить"
        color="light-blue-darken-1"
        @click="modalEditCreate = true"
      />
      <v-btn
        :disabled="!selectedOrder.length"
        text="Изменить"
        color="orange-darken-4"
        class="ml-8 mr-8"
        @click="modalEditCreate = true"
      />
      <v-btn
        :disabled="!selectedOrder.length"
        text="Удалить"
        color="grey-darken-1"
        @click="modalDelete = true"
      />
    </div>

    <template v-if="false" v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        variant="outlined"
        hide-details
        single-line
      />
    </template>

    <v-data-table
      v-model="selectedOrder"
      :headers="headers"
      :items="orders"
      :search="search"
      :loading="loading"
      item-value="order_id"
      return-object
      select-strategy="single"
      show-select
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
      </template>
    </v-data-table>
  </v-card>


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
          @click="modalDelete = false"
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


  <v-dialog
    v-model="modalEditCreate"
    max-width="600"
  >
    <v-card title="User Profile">
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-text-field
              label="First name*"
              required
            />
          </v-col>

          <v-col
            cols="12"
            sm="12"
          >
            <v-text-field
              label="Last name*"
              required
            />
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">*indicates required field</small>
      </v-card-text>

      <v-divider class="mt-2" />

      <v-card-actions class="my-2">
        <v-btn
          text="Закрыть"
          @click="modalEditCreate = false"
        />
        <v-btn
          text="Сохранить"
          color="primary"
          variant="flat"
          @click=""
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
<script setup lang="ts">
// TODO: Unify standard async requests (getOrders, getFields), components, create & edit form, check form

import {onMounted, type Ref, ref} from 'vue'
import apiServices from '@/utils/api/apiServices'

const title: string = import.meta.env.VITE_APP_TITLE
const loading: Ref<boolean> = ref(true)
const search: Ref<string> = ref('')
const headers: Ref = ref([])
const selectedOrder: Ref = ref([])
const orders: Ref = ref([])
const modalDelete: Ref<boolean> = ref(false)
const modalEditCreate: Ref<boolean> = ref(false)


const getOrders = async (): Promise<void> => {
  const request = await apiServices.readOrders({})

  request.status === 200
    ? orders.value = request.data
    : ''
}

const getFields = async (): Promise<void> => {
  const request = await apiServices.readFields({})

  if (request.status === 200) {
    headers.value = request.data.map((item: any) => {
      return {
        key: item.field,
        title: item.name
      }
    })
  }
}


/**
 * Initialize Component Requests(libraries, api, integrations, etc.)
 *
 * @function
 * @async
 * @return Promise<void>
 */
const initialize = async (): Promise<void>  => {
  await getOrders()
  await getFields()

  loading.value = false
}


/**
 * Delete Order
 *
 * @function
 * @async
 * @return Promise<void>
 */
const deleteOrder = async (): Promise<void>  => {
  loading.value = true

  const order = selectedOrder.value[0]
  const request = await apiServices.deleteOrder({id: order.order_id})

  console.log(request) // request.status = 200

  selectedOrder.value = []
  modalDelete.value = false

  await initialize()
}



onMounted(async () => {
  await initialize()
})

// watch(selectedOrder, (val) => {
//   console.log(val)
// }, { deep: true })
</script>
