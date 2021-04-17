<template>
    <router-view />
</template>

<style lang="scss">
html,
body {
    padding: 0;
    margin: 0;
    overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  
  overflow-y: scroll;
  position: absolute;
  left: 0;
  top: 0;
  right: -30px;
  bottom: 0;
  padding-right: 15px;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
