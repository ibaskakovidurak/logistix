<template>
  <v-snackbar
    v-model="componentState"
    :color="request === 200 ? 'green-accent-3' : 'deep-orange-accent-4'"
    :timeout="1000"
  >
    {{ notificationInfo.message }}

    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="componentState = false"
      >
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {type Ref, ref, watch} from 'vue'

interface ItemInterface {
  type: number,
  status: string,
  message: string
}

const props = defineProps<{
  state: boolean,
  timeout: number,
  notificationInfo: ItemInterface,
}>()

const emits = defineEmits<{
  (e: 'close', flag: boolean): void
}>()

const componentState: Ref = ref(true)
const request: Ref<number> = ref(props.notificationInfo.type)


/**
 * Custom timeout (for example)
 */
watch(componentState, (val) => {
  setTimeout(() => {
    emits('close', true)
  }, props.timeout)
})
</script>