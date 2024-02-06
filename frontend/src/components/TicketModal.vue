<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="dialog-card q-dialog-plugin">
      <q-card-section class="row">
        <div class="text-h6">Приобрести билет</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <template v-if="isLoading">
        <q-spinner color="primary" size="3em" />
      </template>
      <template v-else>
        <q-card-section>
          <q-list>
            <q-item
              class="q-px-none"
              v-for="(ticket, idx) of listInfo"
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
          <q-card
            class="carriage-card"
            v-for="(carriage, idx) in trip?.train.carriages"
            :key="carriage.id"
          >
            <q-card-section class="row items-center">
              <div class="col">
                <div class="row">
                  <div class="col-auto">
                    <div class="text-h6">Вагон №{{ idx + 1 }}</div>
                    <div class="text-caption">
                      {{ CarriageTypes[carriage.type] }}
                    </div>
                  </div>
                  <q-space />
                  <div class="col-auto text-right">
                    <div class="text-subtitle1">
                      Свободных мест: <b>{{ carriage.free_places.count }}</b>
                    </div>
                    <div class="text-subtitle1">
                      от <b>{{ carriage.free_places.min_price }}</b
                      >₽
                    </div>
                  </div>
                </div>
              </div>
              <div class="q-pl-sm">
                <q-btn
                  color="grey"
                  round
                  flat
                  :icon="
                    carriage.expanded
                      ? 'keyboard_arrow_up'
                      : 'keyboard_arrow_down'
                  "
                  @click="carriage.expanded = !carriage.expanded"
                />
              </div>
            </q-card-section>

            <q-slide-transition>
              <div v-if="carriage.expanded">
                <q-separator />
                <q-card-section class="q-pa-none">
                  <q-table
                    flat
                    :columns="seatsTableColumns[carriage.type]"
                    :rows="seatsTableRows"
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
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QTableProps, useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import getFormattedDate from 'src/utils/getFormattedDate';
import Api from 'src/api/api';
import {
  TripWithDetailedInfo,
  CarriageTypes,
} from 'src/models/tripWithDetailedInfo.dto';

interface Props {
  id: string;
}

const props = defineProps<Props>();

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

const isLoading = ref(true);

const trip = ref<TripWithDetailedInfo>();

enum locomotiveTypes {
  'Стандартный' = 1,
  'Скоростной' = 2,
  'Сверхскоростной' = 3,
}

const listInfo = ref<{ label: string; value: string }[]>([]);

Api.getTripWithDetailedInfoById(props.id).then((data) => {
  if (!data) return;

  console.log(data);

  data.train.carriages.forEach((carriage) => {
    carriage.expanded = false;
  });

  trip.value = data;

  listInfo.value.push(
    ...[
      {
        label: 'Пункт отправления',
        value: trip.value.departureCity,
      },
      {
        label: 'Пункт назначения',
        value: trip.value.destinationCity,
      },
      {
        label: 'Дата отправления',
        value: getFormattedDate(trip.value.departureDate),
      },
      {
        label: 'Дата прибытия',
        value: getFormattedDate(trip.value.destinationDate),
      },
      {
        label: 'Тип поезда',
        value: locomotiveTypes[trip.value.train.locomotive.type],
      },
      {
        label: 'Номер поезда',
        value: trip.value?.train.locomotive.name,
      },
    ]
  );

  isLoading.value = false;
});

// 1 - сидячий вагон
// 2 - плацкарт
// 3 - купе
// 4 - СВ
const seatsTableColumns = ref<Record<number, QTableProps['columns']>>({
  1: [
    {
      name: 'number',
      label: 'Место',
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
      label: 'Место',
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

const seatsTableRows = ref([]);
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
