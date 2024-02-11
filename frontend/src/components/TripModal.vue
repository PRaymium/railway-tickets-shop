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
              <div class="carriage-info">
                <div class="carriage-info__left">
                  <div class="text-h6">Вагон №{{ idx + 1 }}</div>
                  <div class="text-caption">
                    {{ CarriageTypes[carriage.type] }}
                  </div>
                </div>
                <div class="carriage-info__right">
                  <div class="text-subtitle1">
                    Свободных мест:
                    <b>{{
                      freePlacesInfoByCarriageId[carriage.id]?.places ??
                      carriage.freePlaces.count
                    }}</b>
                  </div>
                  <div class="text-subtitle1">
                    от
                    <b>{{
                      freePlacesInfoByCarriageId[carriage.id]?.minPrice ??
                      carriage.freePlaces.minPrice
                    }}</b
                    >₽
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
                    :rows="displayedCarriageTicketsInfo[carriage.id]"
                    :row-key="(row: CarriageWithSeatsAndTicket['seats'][0]) => row.id.toString()"
                    :binary-state-sort="true"
                    selection="multiple"
                    v-model:selected="selectedTicketsRaw"
                    :pagination="{
                      rowsPerPage: 20,
                    }"
                    :loading="ticketsTableLoadingStates[carriage.id]"
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
            :grid="$q.screen.xs"
            grid-header
            :columns="ticketsTableColumns"
            :rows="selectedTickets"
            :row-key="(row) => row.id.toString()"
            :binary-state-sort="true"
            hide-pagination
            :pagination="{
              rowsPerPage: 0,
            }"
            no-data-label="Выберите билеты"
            ref="selectedTicketsTableRef"
          >
            <template #body-cell-remove="props">
              <q-td :props="props">
                <q-btn
                  flat
                  icon="delete"
                  @click="ticketRemoveHandler(props.rowIndex)"
                ></q-btn>
              </q-td>
            </template>

            <template #header v-if="$q.screen.xs">
              <table-sort-select
                :columns="
                  ticketsTableColumns?.filter((col) => col.name !== 'remove')
                "
                :table-ref="selectedTicketsTableRef"
                @select="(value) => selectedTicketsTableRef?.sort(value)"
              />
            </template>

            <template v-slot:item="props">
              <div
                class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              >
                <q-card bordered flat>
                  <q-list dense>
                    <q-item
                      v-for="col in props.cols?.filter(
                        (col: any) => col.name !== 'remove'
                      )"
                      :key="col.name"
                    >
                      <q-item-section>
                        <q-item-label>{{ col.label }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>{{ col.value }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <q-btn
                    class="full-width text-caption q-mt-sm"
                    @click="ticketRemoveHandler(props.rowIndex)"
                    >Удалить</q-btn
                  >
                </q-card>
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions>
          <q-btn
            class="full-width"
            size="1rem"
            color="primary"
            label="Купить"
            @click="buyTicketsHandler"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>

  <q-dialog v-model="buyErrorModal" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Ошибка при покупке</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>Некоторые билеты недоступны для покупки:</div>
        <div v-for="ticket of buyErrorTickets" :key="ticket.id">
          {{ `Билет №${ticket?.number} в вагоне №${ticket?.carriage.number}` }}
        </div>
        <div class="q-mt-md">
          Будет произведено обновление доступных билетов
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Обновить данные"
          @click="updateTicketsList()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  QTable,
  QTableProps,
  useDialogPluginComponent,
  useQuasar,
} from 'quasar';
import { computed, ref } from 'vue';
import getFormattedDate from 'src/utils/getFormattedDate';
import Api from 'src/api/api';

import {
  TripWithDetailedInfo,
  CarriageTypes,
} from 'src/models/tripWithDetailedInfo';
import { LocomotiveTypes } from 'src/models/entities/locomotive';
import { SeatPositionType } from 'src/models/entities/seat';
import CarriageWithSeatsAndTicket from 'src/models/carriageWithSeatsAndTicket';
import TableSortSelect from './TableSortSelect.vue';

export interface TripModalProps {
  id: number;
}

const props = defineProps<TripModalProps>();

defineEmits([...useDialogPluginComponent.emits]);

const $q = useQuasar();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const isLoading = ref(true);

const trip = ref<TripWithDetailedInfo>();

// Record<carriageId, boolean>
const carriageExpandedStates = ref<
  Record<TripWithDetailedInfo['train']['carriages'][0]['id'], boolean>
>({});
const ticketsTableLoadingStates = ref<
  Record<TripWithDetailedInfo['train']['carriages'][0]['id'], boolean>
>({});

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
        field: (row: CarriageWithSeatsAndTicket['seats'][0]) => row.number,
        required: true,
        sortable: true,
        align: 'center',
      },
      {
        name: 'price',
        label: 'Стоимость',
        field: (row: CarriageWithSeatsAndTicket['seats'][0]) =>
          row.seatTicket.price,
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
        field: (row: CarriageWithSeatsAndTicket['seats'][0]) => row.number,
        required: true,
        sortable: true,
        align: 'center',
      },
      {
        name: 'position',
        label: 'Расположение',
        field: (row: CarriageWithSeatsAndTicket['seats'][0]) => row.position,
        required: true,
        sortable: true,
        align: 'center',
        format: (val) => SeatPositionType[val],
      },
      {
        name: 'price',
        label: 'Стоимость',
        field: (row: CarriageWithSeatsAndTicket['seats'][0]) =>
          row.seatTicket.price,
        required: true,
        sortable: true,
        align: 'center',
        format: (val) => `${val}₽`,
      },
    ],
  }
);

const carriageTicketsInfo = ref<
  Record<CarriageWithSeatsAndTicket['id'], CarriageWithSeatsAndTicket['seats']>
>([]);

type freePlacesInfoByCarriageIdType = Record<
  CarriageWithSeatsAndTicket['id'],
  { places: number; minPrice: number }
>;

const freePlacesInfoByCarriageId = computed<freePlacesInfoByCarriageIdType>(
  () => {
    const res: freePlacesInfoByCarriageIdType = {};
    Object.keys(carriageTicketsInfo.value).forEach((key) => {
      res[+key] = {
        places: carriageTicketsInfo.value[+key].reduce<number>(
          (acc, seat) => acc + (!seat.seatTicket.isBuyed ? 1 : 0),
          0
        ),
        minPrice: Math.min(
          ...carriageTicketsInfo.value[+key].map(
            (seat) => seat.seatTicket.price
          )
        ),
      };
    });

    return res;
  }
);

const displayedCarriageTicketsInfo = computed<typeof carriageTicketsInfo.value>(
  () => {
    const keys = Object.keys(carriageTicketsInfo.value);
    const res: typeof carriageTicketsInfo.value = {};

    keys.forEach((key: string) => {
      res[+key] = carriageTicketsInfo.value[+key].filter(
        (ticket) => !ticket.seatTicket.isBuyed
      );
    });

    return res;
  }
);

async function carriageClickHandler(carriageId: number) {
  carriageExpandedStates.value[carriageId] =
    !carriageExpandedStates.value[carriageId];

  if (!carriageTicketsInfo.value[carriageId]) {
    if (!trip.value) return;

    const data = await Api.getCarriageWithSeatsAndTicket(trip.value.train.id, [
      carriageId,
    ]);

    if (!data) return;

    carriageTicketsInfo.value[carriageId] = data[0].seats;
    ticketsTableLoadingStates.value[carriageId] = false;
  }
}

const selectedTicketsTableRef = ref<QTable>();

const selectedTicketsRaw = ref<CarriageWithSeatsAndTicket['seats']>([]);

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
  id: CarriageWithSeatsAndTicket['seats'][0]['seatTicket']['id'];
  number: CarriageWithSeatsAndTicket['seats'][0]['number'];
  position: CarriageWithSeatsAndTicket['seats'][0]['position'];
  price: CarriageWithSeatsAndTicket['seats'][0]['seatTicket']['price'];
  carriage: {
    id: CarriageWithSeatsAndTicket['id'];
    type: CarriageTypes;
    number: number;
  };
}

const selectedTickets = computed<Ticket[]>(() => {
  return selectedTicketsRaw.value.map<Ticket>((selectedTicket) => {
    let carriageNumber = 0;
    let carriageType = CarriageTypes.Сидячий;

    trip.value?.train.carriages.forEach((carriage, idx) => {
      if (carriage.id === selectedTicket.carriageId) {
        carriageNumber = idx + 1;
        carriageType = carriage.type;
      }
    });

    return {
      id: selectedTicket.id,
      number: selectedTicket.number,
      position: selectedTicket.position,
      price: selectedTicket.seatTicket.price,
      carriage: {
        id: selectedTicket.carriageId,
        type: carriageType,
        number: carriageNumber,
      },
    } as Ticket;
  });
});

function ticketRemoveHandler(ticketIdx: number) {
  selectedTicketsRaw.value.splice(ticketIdx, 1);
}

const buyErrorModal = ref(false);
const buyErrorTickets = ref<Ticket[]>([]);

async function buyTicketsHandler() {
  const ticketsIds = selectedTickets.value.reduce<number[]>(
    (acc, ticket: Ticket) => {
      acc.push(ticket.id);
      return acc;
    },
    []
  );
  const data = await Api.buyTickets(ticketsIds);
  if (data?.status === 'busy') {
    if (!data.ticketsIds) return;

    buyErrorTickets.value.length = 0;

    data.ticketsIds.forEach((ticketId) => {
      const ticket = selectedTickets.value.find(
        (ticket) => ticket.id === ticketId
      );
      if (ticket) buyErrorTickets.value.push(ticket);
    });

    buyErrorModal.value = true;
  } else {
    $q.notify({
      message: 'Билеты успешно приобретены!',
      type: 'positive',
      position: 'top',
    });
    onDialogOK();
  }
}

async function updateTicketsList() {
  const carriagesIds = Object.keys(carriageTicketsInfo.value).map(
    (key) => +key
  );
  if (!trip.value) return;

  const data = await Api.getCarriageWithSeatsAndTicket(
    trip.value.train.id,
    carriagesIds
  );

  if (!data) return;

  data.forEach((carriage) => {
    carriageTicketsInfo.value[carriage.id] = carriage.seats;
  });
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

.carriage-info {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;

  @media screen and (max-width: 450px) {
    flex-direction: column;
  }

  &__left {
    @media screen and (max-width: 450px) {
      margin-bottom: map.get($space-sm, y);
    }
  }

  &__right {
    text-align: right;

    @media screen and (max-width: 450px) {
      text-align: left;
    }
  }
}
</style>
