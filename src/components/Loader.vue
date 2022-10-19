
<template>
	<div class="loader text-center">
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
				style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;"
				width="71px" height="71px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
				<path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#4ebf79" stroke="none">
					<animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite"
						keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
				</path>
			</svg>
			<div class="mt-2" style="color: #4ebf79;">
				Atualizando banco de dados, aguarde...
			</div>
		</div>
	</div>
</template>
<style scoped>
.loader {
	background-color: rgba(255, 255, 255, 0.9);
	position: fixed;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>