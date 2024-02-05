<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="dialog-card q-dialog-plugin">
      <q-card-section class="row">
        <div class="text-h6">Приобрести билет</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item
            class="q-px-none"
            v-for="(ticket, idx) of ticketInfo"
            :key="idx"
          >
            <q-item-section>
              <q-item-label overline>{{ ticket.label }}</q-item-label>
              <div>{{ ticket.value }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-card class="carriage-card" v-for="n in 2" :key="n">
          <q-card-section class="row items-center">
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="text-h6">Вагон №1</div>
                  <div class="text-caption">Сидячий</div>
                </div>
                <q-space />
                <div class="col text-right">
                  <div class="text-subtitle1">Свободных мест: <b>40</b></div>
                  <div class="text-subtitle1">от <b>5900</b>₽</div>
                </div>
              </div>
            </div>
            <div class="q-pl-sm">
              <q-btn
                color="grey"
                round
                flat
                :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="expanded = !expanded"
              />
            </div>
          </q-card-section>

          <q-slide-transition>
            <div v-if="expanded">
              <q-separator />
              <q-card-section class="q-pa-none">
                <q-table
                  flat
                  :columns="columns[1]"
                  :rows="rows"
                  row-key="id"
                  :binary-state-sort="true"
                  selection="multiple"
                  :pagination="{
                    rowsPerPage: 10,
                  }"
                >
                </q-table>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Купить" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QTableProps, useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import getFormattedDate from 'src/utils/getFormattedDate';
import { TripWithFreePlacesInfo } from 'src/models/TripWithFreePlacesInfo';

const props = defineProps<TripWithFreePlacesInfo>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}

const ticketInfo = ref<{ label: string; value: string }[]>([
  {
    label: 'Пункт отправления',
    value: props.departureCity,
  },
  {
    label: 'Пункт назначения',
    value: props.destinationCity,
  },
  {
    label: 'Дата отправления',
    value: getFormattedDate(props.departureDate),
  },
  {
    label: 'Дата прибытия',
    value: getFormattedDate(props.destinationDate),
  },
]);

const expanded = ref(false);

// 1 - сидячий вагон
// 2 - плацкарт
// 3 - купе
// 4 - СВ
const columns = ref<Record<number, QTableProps['columns']>>({
  1: [
    {
      name: 'number',
      label: 'Номер',
      field: 'number',
      required: true,
      sortable: true,
      align: 'center',
    },
    {
      name: 'price',
      label: 'Стоимость',
      field: 'price',
      required: true,
      sortable: true,
      align: 'center',
      format: (val) => `${val}₽`,
    },
  ],
  2: [
    {
      name: 'number',
      label: 'Номер',
      field: 'number',
      required: true,
      sortable: true,
      align: 'center',
    },
    {
      name: 'position',
      label: 'Расположение',
      field: 'position',
      required: true,
      sortable: true,
      align: 'center',
    },
    {
      name: 'price',
      label: 'Стоимость',
      field: 'price',
      required: true,
      sortable: true,
      align: 'center',
      format: (val) => `${val}₽`,
    },
  ],
});

const rows = ref([]);
</script>

<style lang="scss" scoped>
@use 'sass:map';
.dialog-card {
  width: 100%;
}

.carriage-card {
  &:not(:last-child) {
    margin-bottom: map.get($space-lg, y);
  }
}
</style>
