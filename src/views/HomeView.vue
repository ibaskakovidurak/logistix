<template>
  <v-card class="pa-6">
    <h1 class="text-h3 mb-6">{{ title }}</h1>
    <div class="mb-4 mt-4">
      <v-btn
        :disabled="loading"
        text="Добавить"
        color="light-blue-darken-1"
        @click="openModal('create')"
      />
      <v-btn
        :disabled="!order.length"
        text="Изменить"
        color="orange-darken-4"
        class="ml-8 mr-8"
        @click="openModal('update')"
      />
      <v-btn
        :disabled="!order.length"
        text="Удалить"
        color="grey-darken-1"
        @click="modalDelete = true"
      />
    </div>

    <v-data-table
      v-model="order"
      :headers="fields"
      :items="orders"
      :loading="loading"
      loading-text="Загрузка данных..."
      no-data-text="Данных не найдено"
      items-per-page-text="Кол-во на странице"
      page-text="{0}-{1} из {2}"
      item-value="order_id"
      return-object
      select-strategy="single"
      show-select
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
      </template>

      <template v-slot:headers="{ columns, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <td>
              <span class="mr-2 cursor-pointer text-lg-subtitle-1">{{ column.title }}</span>

              <template v-if="column.key !== 'data-table-select'">
                <v-icon
                  @click="() => toggleSort(column)"
                  :icon="getSortIcon(column)"
                />

                <v-btn
                  variant="plain"
                  density="compact"
                  rounded="xs"
                >
                  <img
                    class="custom-img"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB3aWR0aD0iMTc5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTU5NSAyOTVxMTcgNDEtMTQgNzBsLTQ5MyA0OTN2NzQycTAgNDItMzkgNTktMTMgNS0yNSA1LTI3IDAtNDUtMTlsLTI1Ni0yNTZxLTE5LTE5LTE5LTQ1di00ODZsLTQ5My00OTNxLTMxLTI5LTE0LTcwIDE3LTM5IDU5LTM5aDEyODBxNDIgMCA1OSAzOXoiLz48L3N2Zz4="
                  />
                  <v-menu
                    width="300"
                    activator="parent"
                  >
                    <v-list>
                      <v-text-field
                        v-model.trim="filter[column.key]"
                        class="pa-4"
                        label="Фильтр"
                        :autofocus="true"
                        variant="underlined"
                        @click.stop.prevent
                        @input="filterOrders(column)"
                      />
                      <v-btn
                        @click=""
                        small
                        text="Очистить"
                        color="primary"
                        class="ml-2 mb-2"
                        variant="text"
                        @click.stop.prevent="filterOrders(column, true)"
                      />
                    </v-list>
                  </v-menu>
                </v-btn>
              </template>
            </td>
          </template>
        </tr>
      </template>
    </v-data-table>
  </v-card>

  <modal-delete
    v-if="modalDelete"
    :order-id="order[0]?.order_id"
    @error="createNotification"
    @success="createNotification"
    @close="closeModal"
  />

  <modal-create-edit
    v-if="modalEditCreate"
    :fields="fields"
    :data="order[0]"
    :request-type="requestType"
    @success="createNotification"
    @error="createNotification"
    @close="closeModal"
  />

  <notifications
    v-if="notification"
    :state="notification"
    :timeout="1000"
    :notification-info="notificationInfo"
    @close="notification = false"
  />

</template>
<script setup lang="ts">
import {onMounted, type Ref, ref} from 'vue'
import apiServices from '@/services/api/apiServices'
import ModalDelete from '@/components/ModalDelete.vue'
import ModalCreateEdit from '@/components/ModalCreateEdit.vue'
import Notifications from '@/components/Notifications.vue'

const title: string = import.meta.env.VITE_APP_TITLE
const loading: Ref<boolean> = ref(true)
const requestType: Ref<string> = ref('')
const fields: Ref<Array<any>> = ref([])
const order: Ref<Array<any>> = ref([])
const ordersDefault: Ref<Array<any>> = ref([])
const orders: Ref<Array<any>> = ref([])
const modalDelete: Ref<boolean> = ref(false)
const modalEditCreate: Ref<boolean> = ref(false)
const notification: Ref<boolean> = ref(false)
const filter: Ref<any> = ref()
const notificationInfo: Ref = ref()


/**
 * Toggle modal
 *
 * @function
 * @param requestTypeStr
 * @return void
 */
const openModal = (requestTypeStr: string): void => {
  modalEditCreate.value = true
  requestType.value = requestTypeStr
}


/**
 * Close modal
 *
 * @function
 * @return void
 */
const closeModal = (): void => {
  modalEditCreate.value = modalDelete.value = false
  order.value = []
}


/**
 * Create Notification
 *
 * @function
 * @async
 * @param response
 */
const createNotification = async (response: any): Promise<any> => {
  notification.value = true
  notificationInfo.value = response
  closeModal()

  await initialize({ fields: false })
}


/**
 * Get Orders
 *
 * @function
 * @async
 * @return Promise<void>
 */
const getOrders = async (): Promise<void> => {
  const request = await apiServices.readOrders({})

  if (request.status !== 200) {
    notification.value = true
    notificationInfo.value = request.data
    return
  }

  orders.value = ordersDefault.value = request.data
}


/**
 * Filter Orders
 *
 * @function
 * @param column
 * @param clear
 */
const filterOrders = (column: any, clear: boolean = false): void => {
  const inputValue = filter.value[column.key]

  if (clear) {
    orders.value = ordersDefault.value
    filter.value[column.key] = ''
    return
  }

  inputValue
    ? orders.value = ordersDefault.value.filter((order: any) => {
        const field = order[column.key].toString().toLowerCase()
        return field.includes(inputValue.toString().toLowerCase())
      })
    : orders.value = ordersDefault.value
}


/**
 * Get Fields
 *
 * @function
 * @async
 * @return Promise<void>
 */
const getFields = async (): Promise<void> => {
  const request = await apiServices.readFields()

  if (request.status !== 200) {
    notification.value = true
    notificationInfo.value = request.data
    return
  }

  fields.value = request.data.map((item: any) => {
    return {
      key: item.field,
      type: item.type === 'id' || item.type === 'decimal' ? 'number' : item.type,
      title: item.name
    }
  })

  filter.value = fields.value.reduce((acc: any, cur: any) => {
    acc[cur.key] = ''
    return acc
  }, {})

}



/**
 * Initialize Component Requests(libraries, api, integrations, etc.)
 *
 * @function
 * @async
 * @param load
 * @return Promise<void>
 */
const initialize = async (load: {fields: boolean} = { fields: true }): Promise<void>  => {
  loading.value = true

  await getOrders()
  if (load.fields) await getFields()

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

  const orderDelete = order.value[0]
  const request = await apiServices.deleteOrder({id: orderDelete.order_id})

  notification.value = true

  if (request.status !== 200) {
    await createNotification(request.data)
    return
  }

  await createNotification({
    type: request.status,
    message: 'Заказ был успешно удален!'
  })


  modalDelete.value = false
}


onMounted(async () => {
  await initialize()
})
</script>

<style scoped>
/* For example */
.custom-img{
  display: inline-block;
  width: 16px;
  height: auto;
  cursor: pointer;
}

thead{
  background: #eeeeee;
}
</style>
