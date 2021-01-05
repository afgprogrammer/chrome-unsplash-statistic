<template>
    <section id="home-page">
        <header class="main-header">
            <nav class="d-flex px-4 align-items-center">
                <div class="d-flex align-items-center flex-grow-1">
                    <a href="https://unsplash.com" title="Unsplash Home " class="opacity-1">
                        <svg width="32" height="32" class="_1Jlgk" version="1.1" viewBox="0 0 32 32" aria-labelledby="unsplash-home" aria-hidden="false"><title id="unsplash-home">Unsplash Home</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg>
                    </a>
                    <div class="flex-grow-1 ml-3">
                        <input type="text" class="form-control unsplash-search w-100" placeholder="Search free high-resolution photos">
                    </div>
                </div>
                <div class="ml-3">
                    <ul class="list d-flex align-items-center">
                        <li class="mr-4">
                            <a href="https://unsplash.com/?modal=%7B%22tag%22%3A%22Uploader%22%7D" title="Submit a photo" class="btn btn-submit">Submit a photo</a>
                        </li>
                        <li v-if="user && user.hasOwnProperty('profile_image')">
                            <a :href="`https://unsplash.com/@${user.username}`" class="user-avatar d-block opacity-1">
                                <img :src="user.profile_image.medium" :alt="user.username">
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <div class="height-50p"></div>
        <section class="container">
            <div id="insights">
                <section class="content">
                    <div class="row">
                        <div class="col-lg-4" v-if="user_statistic && user_statistic.hasOwnProperty('views')">
                            <div class="p-3 text-center">
                                <div class="d-flex">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-md font-weight-bold text-gray-800">Views</span>
                                        <span class="text-xlg">{{ user_statistic.views.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div class="height-20p"></div>
                                <div>
                                    <area-chart
                                        :dateList="user_statistic.views.historical.values.map(item => item.date)"
                                        :values="user_statistic.views.historical.values.map(item => item.value)"
                                    ></area-chart>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4" v-if="user_statistic && user_statistic.hasOwnProperty('views')">
                            <div class="p-3 text-center">
                                <div class="d-flex">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-md font-weight-bold text-gray-800">Downloads</span>
                                        <span class="text-xlg">{{ user_statistic.downloads.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div class="height-20p"></div>
                                <div>
                                    <area-chart
                                        :dateList="user_statistic.downloads.historical.values.map(item => item.date)"
                                        :values="user_statistic.downloads.historical.values.map(item => item.value)"
                                    ></area-chart>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4" v-if="user_statistic && user_statistic.hasOwnProperty('views')">
                            <div class="p-3 text-center">
                                <div class="d-flex">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <span class="text-md font-weight-bold text-gray-800">Likes</span>
                                        <span class="text-xlg">{{ user_statistic.likes.total.toLocaleString() }}</span>
                                    </div>
                                </div>
                                <div class="height-20p"></div>
                                <div>
                                    <area-chart
                                        :dateList="user_statistic.downloads.historical.values.map(item => item.date)"
                                        :values="user_statistic.downloads.historical.values.map(item => item.value)"
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

export default {
    components: {
        AreaChart
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
