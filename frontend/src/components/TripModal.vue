<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="dialog-card q-dialog-plugin">
      <q-card-section class="row">
        <div class="text-h5">Приобрести билет</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-separator />

      <template v-if="isLoading">
        <q-spinner color="primary" size="3rem" />
      </template>
      <template v-else>
        <q-card-section>
          <q-list>
            <q-item
              class="q-px-none"
              v-for="(infoItem, idx) of tripInfoList"
              :key="idx"
            >
              <q-item-section>
                <q-item-label overline>{{ infoItem.label }}</q-item-label>
                <div>{{ infoItem.value }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h6 q-mb-md">Выберите места:</div>

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
                      Свободных мест: <b>{{ carriage.freePlaces.count }}</b>
                    </div>
                    <div class="text-subtitle1">
                      от <b>{{ carriage.freePlaces.minPrice }}</b
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
                    carriageExpandedStates[carriage.id]
                      ? 'keyboard_arrow_up'
                      : 'keyboard_arrow_down'
                  "
                  @click="carriageClickHandler(carriage.id)"
                />
              </div>
            </q-card-section>

            <q-slide-transition>
              <div v-if="carriageExpandedStates[carriage.id]">
                <q-separator />
                <q-card-section class="q-pa-none">
                  <q-table
                    dense
                    flat
                    :columns="carriageTicketsTableColumns[carriage.type]"
                    :rows="carriageTicketsInfo[carriage.id]"
                    :row-key="(row: TicketWithSeatInfo) => row.id.toString()"
                    :binary-state-sort="true"
                    selection="multiple"
                    v-model:selected="selectedTicketsRaw"
                    :pagination="{
                      rowsPerPage: 20,
                    }"
                    :loading="ticketsTableLoadingStates[carriage.id]"
                    @selection="console.log(selectedTicketsRaw)"
                  >
                  </q-table>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h6 q-mb-md">Выбранные билеты:</div>

          <q-table
            :dense="$q.screen.xs"
            :columns="ticketsTableColumns"
            :rows="selectedTickets"
            :row-key="(row) => row.id.toString()"
            :binary-state-sort="true"
            hide-pagination
            :pagination="{
              rowsPerPage: 0,
            }"
            no-data-label="Выберите билеты"
          >
            <template #body-cell-remove="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  icon="delete"
                  @click="ticketRemoveHandler(props.rowIndex)"
                ></q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions>
          <q-btn
            class="dialog-action-btn"
            size="1rem"
            color="primary"
            label="Купить"
            @click="onOKClick"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QTableProps, useDialogPluginComponent } from 'quasar';
import { computed, ref } from 'vue';
import getFormattedDate from 'src/utils/getFormattedDate';
import Api from 'src/api/api';

import {
  TripWithDetailedInfo,
  CarriageTypes,
} from 'src/models/tripWithDetailedInfo';
import TicketWithSeatInfo from 'src/models/ticketWithSeatInfo';

export interface TripModalProps {
  id: number;
}

const props = defineProps<TripModalProps>();

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

// Record<carriageId, boolean>
const carriageExpandedStates = ref<
  Record<TripWithDetailedInfo['train']['carriages'][0]['id'], boolean>
>({});
const ticketsTableLoadingStates = ref<
  Record<TripWithDetailedInfo['train']['carriages'][0]['id'], boolean>
>({});

enum LocomotiveTypes {
  'Стандартный' = 1,
  'Скоростной' = 2,
  'Сверхскоростной' = 3,
}

const tripInfoList = ref<{ label: string; value: string }[]>([]);

Api.getTripWithDetailedInfoById(props.id).then((data) => {
  if (!data) return;

  data.train.carriages.forEach((carriage) => {
    carriageExpandedStates.value[carriage.id] = false;
    ticketsTableLoadingStates.value[carriage.id] = true;
  });

  trip.value = data;

  tripInfoList.value.push(
    ...[
      {
        label: 'Пункт отправления',
        value: trip.value.departureCityName,
      },
      {
        label: 'Пункт назначения',
        value: trip.value.destinationCityName,
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
        value: LocomotiveTypes[trip.value.train.locomotive.type],
      },
      {
        label: 'Номер поезда',
        value: trip.value?.train.locomotive.name,
      },
    ]
  );

  isLoading.value = false;
});

enum SeatPositionType {
  'Нижнее' = 0,
  'Верхнее' = 1,
}

// 1 - сидячий вагон
// 2 - плацкарт
// 3 - купе
// 4 - СВ
const carriageTicketsTableColumns = ref<Record<number, QTableProps['columns']>>(
  {
    1: [
      {
        name: 'number',
        label: 'Место',
        field: (row: TicketWithSeatInfo) => row.seat.number,
        required: true,
        sortable: true,
        align: 'center',
      },
      {
        name: 'price',
        label: 'Стоимость',
        field: (row: TicketWithSeatInfo) => row.price,
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
        field: (row: TicketWithSeatInfo) => row.seat.number,
        required: true,
        sortable: true,
        align: 'center',
      },
      {
        name: 'position',
        label: 'Расположение',
        field: (row: TicketWithSeatInfo) => row.seat.position,
        required: true,
        sortable: true,
        align: 'center',
        format: (val) => SeatPositionType[val],
      },
      {
        name: 'price',
        label: 'Стоимость',
        field: (row: TicketWithSeatInfo) => row.price,
        required: true,
        sortable: true,
        align: 'center',
        format: (val) => `${val}₽`,
      },
    ],
  }
);

const carriageTicketsInfo = ref<
  Record<TicketWithSeatInfo['seat']['carriageId'], TicketWithSeatInfo[]>
>({});

async function carriageClickHandler(carriageId: number) {
  carriageExpandedStates.value[carriageId] =
    !carriageExpandedStates.value[carriageId];

  if (!carriageTicketsInfo.value[carriageId]) {
    const data = await Api.getTicketsWithSeatInfoByCarriageId(carriageId);

    if (!data) return;

    carriageTicketsInfo.value[carriageId] = data;
    ticketsTableLoadingStates.value[carriageId] = false;
  }
}

const selectedTicketsRaw = ref<TicketWithSeatInfo[]>([]);

const ticketsTableColumns = ref<QTableProps['columns']>([
  {
    name: 'carriageNumber',
    label: 'Номер вагона',
    field: (row: Ticket) => row.carriage.number,
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'carriageType',
    label: 'Тип вагона',
    field: (row: Ticket) => row.carriage.type,
    required: true,
    sortable: true,
    align: 'center',
    format: (val) => CarriageTypes[val],
  },
  {
    name: 'number',
    label: 'Место',
    field: (row: Ticket) => row.number,
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'position',
    label: 'Расположение',
    field: (row: Ticket) => row.position,
    required: true,
    sortable: true,
    align: 'center',
    format: (val, row: Ticket) => {
      return row.carriage.type === 1 ? 'Сидячее' : SeatPositionType[val];
    },
  },
  {
    name: 'price',
    label: 'Стоимость',
    field: (row: Ticket) => row.price,
    required: true,
    sortable: true,
    align: 'center',
    format: (val) => `${val}₽`,
  },
  {
    name: 'remove',
    label: 'Удалить',
    field: '',
    required: true,
  },
]);

interface Ticket {
  id: TicketWithSeatInfo['id'];
  number: TicketWithSeatInfo['seat']['number'];
  position: SeatPositionType;
  price: TicketWithSeatInfo['price'];
  carriage: {
    id: TicketWithSeatInfo['seat']['carriageId'];
    type: CarriageTypes;
    number: number;
  };
}

const selectedTickets = computed<Ticket[]>(() => {
  return selectedTicketsRaw.value.map<Ticket>((selectedTicket) => {
    let carriageNumber = 0;
    let carriageType = CarriageTypes.Сидячий;

    trip.value?.train.carriages.forEach((carriage, idx) => {
      if (carriage.id === selectedTicket.seat.carriageId) {
        carriageNumber = idx + 1;
        carriageType = carriage.type;
      }
    });

    return {
      id: selectedTicket.id,
      number: selectedTicket.seat.number,
      position: selectedTicket.seat.position,
      price: selectedTicket.price,
      carriage: {
        id: selectedTicket.seat.carriageId,
        type: carriageType,
        number: carriageNumber,
      },
    } as Ticket;
  });
});

function ticketRemoveHandler(ticketIdx: number) {
  selectedTicketsRaw.value.splice(ticketIdx, 1);
}
</script>

<style lang="scss" scoped>
@use 'sass:map';
.dialog-card {
  width: 100%;
  max-width: 900px;
}

.carriage-card {
  &:not(:last-child) {
    margin-bottom: map.get($space-lg, y);
  }
}

.dialog-action-btn {
  width: 100%;
}
</style>
