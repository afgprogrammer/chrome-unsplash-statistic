<template>
    <home-page v-if="isConfigured"></home-page>
    <configuration-page v-else></configuration-page>
</template>

<script>
import HomePage from './pages/Home'
import ConfigurationPage from './pages/Configuration'

export default {
    components: { HomePage, ConfigurationPage },
    computed: {
        isConfigured() {
            let access_key = localStorage.getItem('access_key')
            if (!access_key)
                return false

            let user = localStorage.getItem('user_details')
            if (!user)
                return false

            return true
        }
    }
}
</script>

<style lang="scss">
@import './assets/scss/app.scss';
</style>
