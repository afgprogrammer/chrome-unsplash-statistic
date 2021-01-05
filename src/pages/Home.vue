<template>
    <section id="home-page">
        <main-header :user="user"></main-header>
        <div class="height-50p"></div>
        <section class="container">
            <div id="insights">
                <section class="content">
                    <div class="row">
                        <div class="col-lg-4" v-if="user_statistic && user_statistic.hasOwnProperty('views')">
                            <div class="p-3 text-center bordered rounded-5">
                                <div class="d-flex pt-4">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm font-weight-bold text-gray-800">Views</span>
                                        <span class="text-xlg">{{ user_statistic.views.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div>
                                    <area-chart
                                        :dateList="user_statistic.views.historical.values.map(item => item.date)"
                                        :values="user_statistic.views.historical.values.map(item => item.value)"
                                    ></area-chart>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4" v-if="user_statistic && user_statistic.hasOwnProperty('downloads')">
                            <div class="p-3 text-center bordered rounded-5">
                                <div class="d-flex pt-4">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm font-weight-bold text-gray-800">Downloads</span>
                                        <span class="text-xlg">{{ user_statistic.downloads.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div>
                                    <area-chart
                                        :dateList="user_statistic.downloads.historical.values.map(item => item.date)"
                                        :values="user_statistic.downloads.historical.values.map(item => item.value)"
                                    ></area-chart>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4" v-if="user_statistic && user_statistic.hasOwnProperty('likes')">
                            <div class="p-3 text-center bordered rounded-5">
                                <div class="d-flex pt-4">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-sm font-weight-bold text-gray-800">Likes</span>
                                        <span class="text-xlg">{{ user_statistic.likes.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div>
                                    <area-chart
                                        :dateList="user_statistic.likes.historical.values.map(item => item.date)"
                                        :values="user_statistic.likes.historical.values.map(item => item.value)"
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
                                </footer>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
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
            user: {},
            user_statistic: {},
            last_fetch: '',
            photos: []
        }
    },

    mounted() {
        this.last_fetch = localStorage.getItem('last_fetch')
        if (this.last_fetch) {
            let diff = Math.floor(new Date().getTime() / 60000) - Math.floor(new Date(this.last_fetch) / 60000)

            if (diff >= 20) {
                this.fetchUser()
                this.fetchPopular()
                this.fetchUserStatistic()

                return localStorage.setItem('last_fetch', new Date())
            }

        }

        this.user = JSON.parse(localStorage.getItem('user_details'))
        if (!this.user) 
            this.fetchUser()

        this.user_statistic = JSON.parse(localStorage.getItem('user_statistic'))
        if (!this.user_statistic)
            this.fetchUserStatistic()

        this.photos = JSON.parse(localStorage.getItem('photos'))
        if (!this.photos)
            this.fetchPopular()

        this.last_fetch = localStorage.getItem('last_fetch')
        if (!this.last_fetch)
            localStorage.setItem('last_fetch', new Date())
    },

    methods: {
        fetchUser() {
            axios
                .get('users/afgprogrammer')
                .then((response) => {
                    this.user = response.data
                    localStorage.setItem('user_details', JSON.stringify(this.user))
                })
        },

        fetchUserStatistic() {
            axios
                .get('users/afgprogrammer/statistics')
                .then((response) => {
                    this.user_statistic = response.data
                    localStorage.setItem('user_statistic', JSON.stringify(this.user_statistic))
                })
        },

        fetchPopular() {
            axios
                .get('users/afgprogrammer/photos?stats=true&order_by=popular&per_page=50')
                .then((response) => {
                    this.photos = response.data
                    localStorage.setItem('photos', JSON.stringify(this.photos))
                })
        },

        humanDate(date) {
            return new Date(date).toDateString()
        }
    }
}
</script>
