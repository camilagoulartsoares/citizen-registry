<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCitizen } from '@/composables/useCitizen'

const router = useRouter()
const { downloadCitizensCsv } = useCitizen()
const downloading = ref(false)

const items = [
  {
    title: 'Cadastrar cidadão',
    subtitle: 'Cadastre um novo cidadão no sistema',
    icon: 'mdi-account-plus-outline',
    to: '/cadastrar',
  },
  {
    title: 'Consultar CPF',
    subtitle: 'Busque cidadãos por nome ou CPF',
    icon: 'mdi-magnify',
    to: '/consultar',
  },
  {
    title: 'Lista de cidadãos',
    subtitle: 'Ver todos cadastrados',
    icon: 'mdi-format-list-bulleted',
    to: '/citizens',
  },
  {
    title: 'Baixar CSV',
    subtitle: 'Exportar cidadãos cadastrados',
    icon: 'mdi-download',
    action: 'download',
  },
]

function handleClick(item) {
  if (item.to) {
    router.push(item.to)
    return
  }

  if (item.action === 'download') {
    handleDownload()
  }
}

async function handleDownload() {
  if (downloading.value) return
  downloading.value = true
  try {
    await downloadCitizensCsv()
  } catch {
    // erro exibido pelo composable quando necessário
  } finally {
    downloading.value = false
  }
}
</script>

<template>
  <div>
    <div class="section-header">
      <div class="section-header__top">
        <v-icon size="20" color="primary">mdi-lightning-bolt-outline</v-icon>
        <h2 class="section-title">Acesso rápido</h2>
      </div>
      <p class="section-subtitle">Atalhos para as principais funcionalidades do sistema.</p>
    </div>

    <v-row>
      <v-col
        v-for="item in items"
        :key="item.title"
        cols="12"
        sm="6"
        md="3"
      >
        <component
          :is="item.to ? 'router-link' : 'div'"
          :to="item.to"
          class="quick-card"
          :class="{ 'quick-card--loading': item.action === 'download' && downloading }"
          @click="!item.to && handleClick(item)"
        >
          <div class="quick-card__icon-wrap">
            <v-icon class="quick-card__icon" size="20">{{ item.icon }}</v-icon>
          </div>
          <div class="quick-card__title">{{ item.title }}</div>
          <div class="quick-card__subtitle">{{ item.subtitle }}</div>
          <div class="quick-card__arrow">
            <v-progress-circular
              v-if="item.action === 'download' && downloading"
              indeterminate
              size="14"
              width="2"
              color="primary"
            />
            <v-icon v-else class="quick-card__arrow-icon" size="14">mdi-arrow-right</v-icon>
          </div>
        </component>
      </v-col>
    </v-row>
  </div>
</template>
