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
            v-for="carriage in trip?.train?.carriages"
            :key="carriage.id"
          >
            <template v-if="carriage.seats?.length !== 0">
              <q-card-section class="row items-center">
                <div class="carriage-info">
                  <div class="carriage-info__left">
                    <div class="text-h6">Вагон №{{ carriage.number }}</div>
                    <div class="text-caption">
                      {{ CarriageTypes[carriage.type] }}
                    </div>
                  </div>
                  <div class="carriage-info__right">
                    <div class="text-subtitle1">
                      Свободных мест:
                      <b>{{
                        tripsStore.getFreePlacesInCarriage[carriage.id].count
                      }}</b>
                    </div>
                    <div class="text-subtitle1">
                      от
                      <b>{{
                        tripsStore.getFreePlacesInCarriage[carriage.id].minPrice
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
            </template>

            <q-slide-transition>
              <div v-if="carriageExpandedStates[carriage.id]">
                <q-separator />
                <q-card-section class="q-pa-none">
                  <q-table
                    dense
                    flat
                    :columns="carriageTicketsTableColumns[carriage.type]"
                    :rows="carriageTicketsTableRows[carriage.id]"
                    :row-key="(row: CarriageTicketsRow) => row.id.toString()"
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
            :row-key="(row: Ticket) => row.id.toString()"
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
          @click="updateSeatsList()"
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
import TableSortSelect from './TableSortSelect.vue';
import { StoredTrip, useTripsStore } from 'src/stores/tripsStore';

import { CarriageTypes } from 'src/models/tripWithDetailedInfo';
import { LocomotiveTypes } from 'src/models/entities/locomotive';
import { SeatPositionType } from 'src/models/entities/seat';
import Carriage from 'src/models/entities/carriage';

export interface TripModalProps {
  id: number;
}

const props = defineProps<TripModalProps>();

defineEmits([...useDialogPluginComponent.emits]);

const $q = useQuasar();

const tripsStore = useTripsStore();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const isLoading = ref(true);

const trip = ref<StoredTrip | null>(null);

// Record<carriageId, boolean>
const carriageExpandedStates = ref<Record<Carriage['id'], boolean>>({});
const ticketsTableLoadingStates = ref<Record<Carriage['id'], boolean>>({});

const tripInfoList = ref<{ label: string; value: string }[]>([]);

tripsStore.getFreeTripById(props.id).then((data) => {
  if (!data) return;

  trip.value = data;

  checkTripAvailability();

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value: LocomotiveTypes[trip.value.train!.locomotive!.type],
      },
      {
        label: 'Номер поезда',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value: trip.value.train!.locomotive!.name,
      },
    ]
  );

  isLoading.value = false;
});

interface CarriageTicketsRow {
  id: number;
  number: number;
  position: SeatPositionType;
  price: number;
  seatId: number;
  carriageId: number;
}

const carriageTicketsTableColumns = ref<
  Record<CarriageTypes, QTableProps['columns']>
>({
  [CarriageTypes['Сидячий']]: [
    {
      name: 'number',
      label: 'Место',
      field: (row: CarriageTicketsRow) => row.number,
      required: true,
      sortable: true,
      align: 'center',
    },
    {
      name: 'price',
      label: 'Стоимость',
      field: (row: CarriageTicketsRow) => row.price,
      required: true,
      sortable: true,
      align: 'center',
      format: (val) => `${val}₽`,
    },
  ],
  [CarriageTypes['Плацкарт']]: [
    {
      name: 'number',
      label: 'Место',
      field: (row: CarriageTicketsRow) => row.number,
      required: true,
      sortable: true,
      align: 'center',
    },
    {
      name: 'position',
      label: 'Расположение',
      field: (row: CarriageTicketsRow) => row.position,
      required: true,
      sortable: true,
      align: 'center',
      format: (val) => SeatPositionType[val],
    },
    {
      name: 'price',
      label: 'Стоимость',
      field: (row: CarriageTicketsRow) => row.price,
      required: true,
      sortable: true,
      align: 'center',
      format: (val) => `${val}₽`,
    },
  ],
  [CarriageTypes['Купе']]: undefined,
  [CarriageTypes['СВ']]: undefined,
});

const carriageTicketsTableRows = computed(() => {
  const carriageIds = trip.value?.train?.carriages?.map(
    (carriage) => carriage.id
  );
  const res: Record<Carriage['id'], CarriageTicketsRow[]> = {};

  if (!carriageIds) return [];

  carriageIds.forEach((id) => {
    const carriage = trip.value?.train?.carriages?.find(
      (carriage) => carriage.id === id
    );

    if (!carriage) res[id] = [];
    else {
      if (!carriage.seats) return [];

      res[id] = carriage.seats
        .filter((seat) => !seat.seatTicket.isBuyed)
        .map((seat) => {
          return {
            id: seat.seatTicket.id,
            number: seat.number,
            position: seat.position,
            price: seat.seatTicket.price,
            seatId: seat.id,
            carriageId: carriage.id,
          };
        });
    }
  });

  return res;
});

async function carriageClickHandler(carriageId: number) {
  carriageExpandedStates.value[carriageId] =
    !carriageExpandedStates.value[carriageId];

  const foundCarriage = trip.value?.train?.carriages?.find(
    (carriage) => carriage.id === carriageId
  );

  const trainId = trip.value?.train?.id;

  if (!foundCarriage?.seats) {
    await tripsStore.fetchCarriageWithSeatsAndTicket(trainId as number, [
      carriageId,
    ]);

    checkTripAvailability();
  }

  ticketsTableLoadingStates.value[carriageId] = false;
}

const selectedTicketsTableRef = ref<QTable>();

interface Ticket {
  id: CarriageTicketsRow['id'];
  number: CarriageTicketsRow['number'];
  position: CarriageTicketsRow['position'];
  price: CarriageTicketsRow['price'];
  seatId: CarriageTicketsRow['seatId'];
  carriage: {
    id: Carriage['id'];
    type: CarriageTypes;
    number: number;
  };
}

const selectedTicketsRaw = ref<CarriageTicketsRow[]>([]);
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

const selectedTickets = computed<Ticket[]>(() => {
  return selectedTicketsRaw.value.map<Ticket>((selectedTicket) => {
    const foundCarriage = trip.value?.train?.carriages?.find(
      (carriage) => carriage.id === selectedTicket.carriageId
    );

    return {
      id: selectedTicket.id,
      number: selectedTicket.number,
      position: selectedTicket.position,
      price: selectedTicket.price,
      seatId: selectedTicket.seatId,
      carriage: {
        id: selectedTicket.carriageId,
        type: foundCarriage?.type,
        number: foundCarriage?.number,
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
  const tickets = selectedTickets.value.map((ticket) => {
    return {
      ticketId: ticket.id,
      carriageId: ticket.carriage.id,
    };
  });

  if (tickets.length === 0) {
    $q.notify({
      message: 'Вы ничего не выбрали!',
      type: 'warning',
      position: 'top',
    });
    return;
  }

  const data = await tripsStore.buyTickets(trip.value?.id as number, tickets);

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

async function updateSeatsList() {
  const carriagesIds = trip.value?.train?.carriages?.map(
    (carriage) => carriage.id
  );

  await tripsStore.fetchCarriageWithSeatsAndTicket(
    trip.value?.train?.id as number,
    carriagesIds as number[]
  );

  checkTripAvailability();
}

function checkTripAvailability() {
  if (
    !trip.value ||
    trip.value.train?.carriages?.length === 0 ||
    tripsStore.getTotalFreePlacesInTrip[trip.value.id].count === 0
  ) {
    $q.notify({
      message: 'Данный рейс более не доступен',
      type: 'warning',
      position: 'top',
    });

    onDialogOK({ updateTrips: true });
  }
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
