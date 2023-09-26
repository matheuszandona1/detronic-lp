document.getElementById("numberInput").addEventListener("input", function () {
	// Remover caracteres não permitidos (aceitando números, ponto e vírgula)
	this.value = this.value.replace(/[^0-9.,]/g, "")

	// Trocar vírgulas por pontos para facilitar a validação
	let valueWithDot = this.value.replace(",", ".")

	// Armazena o valor no localStorage
	localStorage.setItem("valorInserido", this.value)
})

// Quando a página carregar, você pode recuperar o valor inserido anteriormente
window.onload = function () {
	let valorSalvo = localStorage.getItem("valorInserido")
	if (valorSalvo) {
		document.getElementById("numberInput").value = valorSalvo
	}
}

// Function to calculate the discount
function calcularDesconto() {
	const checkbox = document.getElementById("checkbox")
	const tipoConta = checkbox.checked ? "empresa" : "residencia"
	const tarifas = {
		residencia: {
			tarifaCheia: 0.9595,
			tarifaPisCofins: 0.0336,
			tarifaDesconto: 0.9259,
			tarifaIluminacao: 30,
			tarifaRede: 50,
			descontoMax: 0.85,
		},
		empresa: {
			tarifaCheia: 0.9595,
			tarifaPisCofins: 0.0336,
			tarifaDesconto: 0.9259,
			tarifaIluminacao: 30,
			tarifaRede: 100,
			descontoMax: 0.85,
		},
	}
	const valorConta = parseFloat(localStorage.getItem("valorInserido"))

	const consumoReal = valorConta - tarifas[tipoConta].tarifaIluminacao
	const consumoKWH = consumoReal / tarifas[tipoConta].tarifaCheia
	const valorEnergiaDesconto = consumoKWH - tarifas[tipoConta].tarifaRede
	const valorConsumoDesconto = valorEnergiaDesconto * tarifas[tipoConta].tarifaDesconto * tarifas[tipoConta].descontoMax

	const valorPisCofins = tarifas[tipoConta].tarifaPisCofins * valorEnergiaDesconto
	const valorCustoDisponibilidade = tarifas[tipoConta].tarifaRede * tarifas[tipoConta].tarifaCheia

	const valorFinalCusto = valorConsumoDesconto + valorPisCofins + valorCustoDisponibilidade + tarifas[tipoConta].tarifaIluminacao

	const valorFinalDescontoMensal = valorConta - valorFinalCusto

	localStorage.setItem("valorConta", valorConta.toFixed(2))
	localStorage.setItem("valorFinalDescontoMensal", valorFinalDescontoMensal.toFixed(2))

	localStorage.setItem("tipoConta", tipoConta)
}

document.getElementById("checkbox").addEventListener("change", function () {
	const residencia = document.getElementById("residencia")
	const empresa = document.getElementById("empresa")

	if (this.checked) {
		residencia.classList.remove("active")
		empresa.classList.add("active")
		localStorage.setItem("ativo", "empresa")
		console.log("Empresa está ativo agora.")
	} else {
		residencia.classList.add("active")
		empresa.classList.remove("active")
		localStorage.setItem("ativo", "residencia")
		console.log("Residência está ativo agora.")
	}

	calcularDesconto()
})

window.onload = function () {
	const ativo = localStorage.getItem("ativo")
	const checkbox = document.getElementById("checkbox")

	if (ativo === "empresa") {
		checkbox.checked = true
		document.getElementById("residencia").classList.remove("active")
		document.getElementById("empresa").classList.add("active")
	} else {
		checkbox.checked = false
		document.getElementById("residencia").classList.add("active")
		document.getElementById("empresa").classList.remove("active")
	}

	calcularDesconto()
}

localStorage.removeItem("valorFinalDescontoMensalMed", "valorFinalDescontoMensalMin")

document.querySelector(".simulador__form").addEventListener("submit", function (event) {
	event.preventDefault()

	let tipoConta = document.getElementById("checkbox").checked ? "empresa" : "residencia"
	calcularDesconto(tipoConta)

	atualizarValoresDesconto()
})

function atualizarValoresDesconto() {
	const valorDesconto = localStorage.getItem("valorFinalDescontoMensal")

	// Se o valor existir, atualizar os elementos com os IDs apropriados
	if (valorDesconto) {
		document.getElementById("value-monthly").textContent = valorDesconto
		document.getElementById("value-yearly").textContent = (valorDesconto * 12).toFixed(2)
		document.getElementById("value-five").textContent = (valorDesconto * 60).toFixed(2)
	} else {
		console.error("valorFinalDescontoMensal não encontrado no localStorage.")
	}
}

$("#form-open").on("click", function (e) {
	$(this).parent().parent().parent().find(".contact__container")
	$(".contact__container").slideToggle("fast").addClass("d-flex")
})

$(".close-btn").on("click", function (e) {
	$(this).parent().addClass("d-none")
})
