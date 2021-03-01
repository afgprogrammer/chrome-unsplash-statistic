<template>
    <section id="home-page">
        <main-header :user="user"></main-header>
        <div class="height-50p"></div>
        <section class="container" v-if="!isLoading">
            <div id="insights">
                <section class="content">
                    <div class="row">
                        <div class="col-lg-4" v-if="userStatistic && userStatistic.hasOwnProperty('views')">
                            <div class="p-3 text-center bordered rounded-5">
                                <div class="d-flex pt-4">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm font-weight-bold text-gray-800">Views</span>
                                        <span class="text-xlg">{{ userStatistic.views.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div>
                                    <area-chart
                                        :dateList="userStatistic.views.historical.values.map(item => item.date)"
                                        :values="userStatistic.views.historical.values.map(item => item.value)"
                                    ></area-chart>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4" v-if="userStatistic && userStatistic.hasOwnProperty('downloads')">
                            <div class="p-3 text-center bordered rounded-5">
                                <div class="d-flex pt-4">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm font-weight-bold text-gray-800">Downloads</span>
                                        <span class="text-xlg">{{ userStatistic.downloads.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div>
                                    <area-chart
                                        :dateList="userStatistic.downloads.historical.values.map(item => item.date)"
                                        :values="userStatistic.downloads.historical.values.map(item => item.value)"
                                    ></area-chart>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4" v-if="userStatistic && userStatistic.hasOwnProperty('likes')">
                            <div class="p-3 text-center bordered rounded-5">
                                <div class="d-flex pt-4">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm font-weight-bold text-gray-800">Likes</span>
                                        <span class="text-xlg">{{ userStatistic.likes.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div>
                                    <area-chart
                                        :dateList="userStatistic.likes.historical.values.map(item => item.date)"
                                        :values="userStatistic.likes.historical.values.map(item => item.value)"
                                    ></area-chart>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div class="height-50p"></div>
            <div id="photos">
                <header class="py-3">
                    <h1 class="text-md font-weight-bold text-gray-700">Your Photos</h1>
                </header>
                <section class="content">
                    <div class="row" v-if="photos && photos.length">
                        <div class="col-lg-4 mb-4" v-for="(photo, index) in photos" :key="index">
                            <div class="item rounded-5 bordered">
                                <header class="item-header p-3">
                                    <p>#{{ index + 1 }}</p>
                                    <p class="text-gray-400">Published on <span class="text-gray-700">{{ $filters.toHumanDate(photo.created_at) }}</span></p>
                                </header>
                                <div class="item-image">
                                    <img class="w-100" :src="`${photo.urls.raw}&auto=format&fit=crop&w=608&h=390&q=60`" alt="photo">
                                </div>
                                <footer class="d-flex p-3">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm text-gray-500">Views</span>
                                        <span class="font-weight-bold">{{ photo.statistics.views.total.toLocaleString() }}</span>
                                    </div>
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm text-gray-500">Downloads</span>
                                        <span class="font-weight-bold">{{ photo.statistics.downloads.total.toLocaleString() }}</span>
                                    </div>
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm text-gray-500">Likes</span>
                                        <span class="font-weight-bold">{{ photo.statistics.likes.total.toLocaleString() }}</span>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
        <div class="text-center" v-else>
            Loading ...
        </div>
    </section>
</template>

<script>
import AreaChart from '../components/charts/AreaChart'
import MainHeader from '../components/page/Header'

export default {
    components: {
        AreaChart,
        MainHeader
    },

    data() {
        return {
            isLoading: true,
        }
    },

    computed: {
        user() {
            return JSON.parse(localStorage.getItem('un_ext_user_details'))
        },

        username() {
            return this.user.username
        },

        userStatistic() {
            return JSON.parse(localStorage.getItem('un_ext_user_statistic'))
        },

        photos() {
            return JSON.parse(localStorage.getItem('un_ext_photos'))
        },

        lastFetch() {
            return localStorage.getItem('un_ext_last_fetch')
        }
    },

    mounted() {
        this.setup()
    },

    methods: {
        async setup() {
            if (!this.user) {
                return this.backToConfiguration()
            }

            if (!this.lastFetch) {
                return await this.fetch()
            }

            let diff = Math.floor(new Date().getTime() / 60000) - Math.floor(new Date(this.lastFetch) / 60000)

            if (diff >= 60)
                await this.fetch(true)

            this.isLoading = false
        },

        async fetch(withUser = false) {
            if (withUser)
                await this.fetchUser()

            await this.fetchPopular()
            await this.fetchUserStatistic()

            this.setLastFetch()
            this.isLoading = false
        },

        async fetchUser() {
            await axios
                .get(`users/${this.username}`)
                .then((response) => {
                    localStorage.setItem('un_ext_user_details', JSON.stringify(response.data))
                })
        },

        async fetchUserStatistic() {
            await axios
                .get(`users/${this.username}/statistics`)
                .then((response) => {
                    localStorage.setItem('un_ext_user_statistic', JSON.stringify(response.data))
                })
        },

        async fetchPopular() {
            await axios
                .get(`users/${this.username}/photos?stats=true&order_by=popular&per_page=50`)
                .then((response) => {
                    localStorage.setItem('un_ext_photos', JSON.stringify(response.data))
                })
        },

        backToConfiguration() {
            this.removeDate()

            window.location.reload()
        },

        removeDate() {
            localStorage.removeItem('un_ext_photos')
            localStorage.removeItem('un_ext_access_key')
            localStorage.removeItem('un_ext_last_fetch')
            localStorage.removeItem('un_ext_user_details')
            localStorage.removeItem('un_ext_user_statistic')
        },

        setLastFetch() {
            localStorage.setItem('un_ext_last_fetch', new Date())
        }
    }
}
</script>
