<template>
    <div class="loader-widget">
        <div class="loader" :style="{width: width, height: width}"></div>
    </div>
</template>
<script>
    export default {
        props: ['width'],
    }
</script>
<style>
    .loader {animation: spin 1s linear infinite;-webkit-animation: spin 1s linear infinite;position: relative;top: 10%;margin: auto;width: 75px;height: 75px;border-radius: 50%;background: transparent;border: 5px solid #eee;border-top: 5px solid #42a5f5;}
    @-webkit-keyframes spin {
        to {
            border-top-color: #ec407a;
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes spin {
        to {
            border-top-color: #ec407a;
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
</style>
