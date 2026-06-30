<script setup>
import CitizenForm from '@/components/CitizenForm.vue'
import CpfSearch from '@/components/CpfSearch.vue'
</script>

<template>
  <div>
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="text-center mb-6">
          <h1 class="text-h4 font-weight-bold text-primary mb-2">
            Sistema de Cadastro de Cidadãos
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Cadastre novos cidadãos ou consulte registros existentes
          </p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-6 h-100">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-account-plus</v-icon>
            <h2 class="text-h6 font-weight-bold">Cadastrar Cidadão</h2>
          </div>
          <CitizenForm />
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6 h-100">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-magnify</v-icon>
            <h2 class="text-h6 font-weight-bold">Consultar Cidadão</h2>
          </div>
          <CpfSearch />
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col cols="12">
        <v-card class="pa-6">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-lightning-bolt</v-icon>
            <h2 class="text-h6 font-weight-bold">Acesso rápido</h2>
          </div>

          <div class="d-flex flex-wrap ga-3">
            <v-btn
              to="/citizens"
              color="primary"
              variant="tonal"
              prepend-icon="mdi-format-list-bulleted"
            >
              Ver lista de cidadãos
            </v-btn>
            <v-btn
              to="/citizens"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-account-group"
            >
              Gerenciar cadastros
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
