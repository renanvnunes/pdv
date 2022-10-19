<template>
	<div>

		<div class="bar">
			RD Mercados - <b>PDV</b>
		</div>

		<Loader v-if="loader" />

		<div class="box">
			<div class="items back border">
				<div class="title"><b>ADICIONAR PRODUTO</b></div>
				<div class="add-item border">
					<input ref="search_term" v-model="search_term" @keyup="searchItem()" class="form-control"
						type="text" placeholder="Informe o código de barras do produto">
				</div>

				<audio id="beep">
					<source src="./assets/beep.mp3" type="audio/mp3" />
				</audio>
				<audio id="error">
					<source src="./assets/error.mp3" type="audio/mp3" />
				</audio>

				<div class="alert alert-warning text-center mt-4" role="alert" v-if="items.length == 0">
					<b>Caixa Livre</b>
				</div>
				<div v-else>
					<div class="title" style="margin-top: 30px"><b>PRODUTOS ADICIONADOS</b></div>
					<div class="add-item border">

						<table class="table">
							<thead>
								<tr>
									<th scope="col"><small>NOME</small></th>
									<th scope="col" class="text-center"><small>PREÇO</small></th>
									<th scope="col" class="text-center"><small>QUANTIDADE</small></th>
									<th scope="col" class="text-end"><small>TOTAL</small></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(p, index) in items" :key="index">
									<th style="width: 550px; font-weight: normal!important;">
										<span :style="{textDecoration: p.canceled ? 'line-through' : 'none'}">{{ p.name }}</span>
									</th>
									<th class="text-center">R$ {{ money_br(p.sale_price) }}</th>
									<td class="text-center">{{ p.qnt }}</td>
									<th class="text-end">R$ <b>{{ money_br(p.sale_price*p.qnt) }}</b></th>
								</tr>
							</tbody>
						</table>

					</div>
				</div>
			</div>
			<div class="options back border">
				<div class="total">
					<div>TOTAL</div>
					<h1>R$ {{ money_br(total) }}</h1>
				</div>
			</div>
		</div>

		<div class="modal_box" v-if="modal_multiple">
			<div class="content border">
				<div><b>Adicionar item múltiplo</b> - Informe a quantidade</div>
				<hr>
				<input ref="input_multiple" v-model="input_multiple" type="number"
					class="form-control form-control-lg">
			</div>
		</div>

		<div class="modal_box" v-if="modal_cancel">
			<div class="content border">
				<div><b class="text-danger">Cancelar produto</b></div>
				<hr>
				<input @keyup="cancelarProduto()" style="border-color: rgb(223, 70, 85);" ref="input_cancel" v-model="input_cancel" type="text" class="form-control form-control-lg"
					placeholder="Informe o código de barras do produto">
			</div>
		</div>

	</div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'
import Loader from './components/Loader.vue'
import { useToast } from "vue-toastification"

const toast = useToast()

interface Items {
	_id: string,
	name: string,
	ean: number,
	cost_price: number,
	sale_price: number,
	qnt: number,
	canceled: boolean
}

export default defineComponent({
	// type inference enabled
	props: {
		name: String,
		msg: { type: String, required: true }
	},
	data() {
		return {
			refss: '' as any,
			loader: false as boolean,
			products: [] as any,
			search_term: "" as any,
			items: [] as Items[],
			total: 0 as number,

			modal_cancel: false as boolean,
			input_cancel: '' as string,

			modal_multiple: false as boolean,
			input_multiple: '' as string,
		}
	},
	created() {
		this.getdata()
	},
	mounted() {

		this.refss = this.$refs
		setTimeout(() => {
			this.refss.search_term.focus()
		}, 50)

		window.addEventListener('keydown', (e) => {

			if (e.key == 'Delete') {
				this.closeAllModals()
				this.modal_cancel = true

				this.$nextTick(() => {    
					this.refss.input_cancel.focus()
  				})

			}

			if (e.key == 'Insert') {
				this.closeAllModals()
				this.modal_multiple = true
				this.input_multiple = ''

				this.$nextTick(() => { 
					this.refss.input_multiple.focus()
				})
			}

			if(e.key == 'Enter' && this.modal_multiple){
				if(this.input_multiple != ''){
					this.refss.search_term.focus()
					this.modal_multiple = false
				}
			}

			if (e.key == 'Escape') {
				this.closeAllModals()
				setTimeout(() => {
					this.refss.search_term.focus()
				}, 50)
			}

		})

	},
	methods: {
		cancelarProduto(){
			let input_cancel: any = this.input_cancel
			
			if(input_cancel.length > 5 && !isNaN(input_cancel)){

				toast.clear()

				let index = this.items.map((e: any) => {
					return e.ean
				}).indexOf(Number(input_cancel))

				console.log(index)
				if(index < 0){
					this.play_beep('error')
					this.input_cancel = ''
					toast.error("Produto não encontrado!")
					return
				}

				this.items[index].canceled = true
			}
		},
		closeAllModals() : any{
			this.modal_cancel = false
			this.modal_multiple = false

			this.input_cancel = ''
			this.input_multiple = ''

		},
		money_br(value: any) {
			let value2 = parseFloat(value)
			return value2.toLocaleString('pt-br', { minimumFractionDigits: 2 })
		},
		totalCost() {
			let total = 0
			for (let item of this.items) {
				total += item.sale_price * Number(item.qnt)
			}

			this.total = total
		},
		play_beep(option: string) {
			let vid: any = document.getElementById(option);
			vid.play()
		},
		searchItem() {

			let search_term = this.search_term.toLowerCase()

			if (search_term.length < 5) {
				return
			}

			toast.clear()

			let search: any
			if (search_term.length > 10 && !isNaN(parseFloat(search_term)) && isFinite(search_term)) {
				search = this.products.find((e: any) => e.ean == search_term)

				if (search == undefined) {
					this.search_term = ''
					this.play_beep('error')
					toast.error("Produto não encontrado!")
					return
				}

				let index = this.items.map((e: any) => {
					return e.ean
				}).indexOf(Number(search_term))

				if (index > -1) {

					this.items[index].qnt = Number(this.items[index].qnt) + Number(this.input_multiple ? this.input_multiple : 1)

				} else {
					search.qnt = 1

					this.items.push({
						_id: search._id,
						name: search.name,
						ean: search.ean,
						cost_price: search.cost_price.$numberDecimal,
						sale_price: search.sale_price.$numberDecimal,
						qnt: this.input_multiple ? Number(this.input_multiple) : 1,
						canceled: false
					})
				}

				this.play_beep('beep')
				this.totalCost()
				this.search_term = ''
				this.input_multiple = ''
				this.refss.search_term.focus()
			}

		},
		async getdata() {
			this.products = []
			this.loader = true
			await axios.get("https://dutoeo.conteige.cloud/products", {
				headers: {
					Authorization: "",
					EI: ""
				}
			}).then(resp => {
				this.loader = false
				this.products = resp.data;
			}).catch(error => {
				this.loader = false
				console.log(error);
			});
		}
	},
	components: { Loader }
})

</script>


<style scoped>
.logo.vite:hover {
	filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
	filter: drop-shadow(0 0 2em #249b73);
}

.modal_box {
	background-color: rgba(0, 0, 0, 0.8);
	z-index: 3000;
	position: fixed;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal_box .content {
	width: 600px;
	padding: 50px;
	background-color: #fff;
	margin: 0 auto;
	box-shadow: 2px 2px 7px 2px rgba(0, 0, 0, 0.3);
}
</style>
