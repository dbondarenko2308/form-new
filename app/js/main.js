$(document).ready(function() {
	$('.select2').select2({
		placeholder: 'Регион',
		minimumResultsForSearch: 1
	})



	$('.field input, .field-area textarea').keyup(function() {
		const label = $(this).parent().find('.field__label')
		const span = $(this).parent().find('.field__error')
		if ($(this).val().length > 0) {
			$(label).addClass('top')
			$(this).removeClass('error')
			$(span).hide()
		} else {
			$(label).removeClass('top')
		}
	})

	$('[data-fancybox]').fancybox({
		touch: false
	})

	$(function() {
		const inputs = document.querySelectorAll('.form-control.tel')

		// Удаляем старые инстансы intlTelInput, если есть
		$('.iti.iti--allow-dropdown.iti--separate-dial-code').each(function() {
			const itiInstance = $(this).data('intlTelInput')
			if (itiInstance) {
				itiInstance.destroy()
			}
		})

		inputs.forEach(input => {
			const iti = intlTelInput(input, {
				initialCountry: 'ru',
				separateDialCode: true,
				formatOnDisplay: false,
				utilsScript:
					'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.0/js/utils.js'
			})

			// Сохраняем предыдущее значение (при необходимости)
			let lastCleanNumber = ''

			input.addEventListener('input', function() {
				const countryCode = iti.getSelectedCountryData().iso2
				let phoneNumber = this.value.replace(/\D/g, '')

				// Ограничиваем длину номера в зависимости от страны
				if (countryCode === 'ru' || countryCode === 'kz') {
					phoneNumber = phoneNumber.substring(0, 10)
					this.value = formatPhoneNumber(phoneNumber, '(XXX) XXX-XX-XX')
				} else if (countryCode === 'uz' || countryCode === 'by') {
					phoneNumber = phoneNumber.substring(0, 9)
					this.value = formatPhoneNumber(phoneNumber, '(XX) XXX-XX-XX')
				} else {
					this.value = phoneNumber
				}

				lastCleanNumber = phoneNumber
			})

			input.addEventListener('beforeinput', function(e) {
				if (e.inputType === 'deleteContentBackward') {
					let raw = this.value.replace(/\D/g, '')
					raw = raw.slice(0, -1)

					const countryCode = iti.getSelectedCountryData().iso2

					if (raw.length === 0) {
						this.value = '' // очищаем поле полностью
					} else if (countryCode === 'ru' || countryCode === 'kz') {
						this.value = formatPhoneNumber(raw, '(XXX) XXX-XX-XX')
					} else if (countryCode === 'uz' || countryCode === 'by') {
						this.value = formatPhoneNumber(raw, '(XX) XXX-XX-XX')
					} else {
						this.value = raw
					}

					e.preventDefault() // не даём браузеру самому удалять
				}
			})
		})

		// Функция форматирования номера по шаблону
		function formatPhoneNumber(number, pattern) {
			let i = 0
			return pattern
				.replace(/X/g, () => (i < number.length ? number[i++] : ''))
				.replace(/[-()\s]+$/, '') // убираем хвост, если недозаполнено
		}
	})

	$('.field-file input').on('change', function(event) {
		let file = event.target.files[0]
		let fileWrapper = $(this).closest('.field-file')
		let fileInfoBlock = fileWrapper.find('.field-file__info')
		let fileIconBlock = fileWrapper.find('.field-file__icon')
		let instructionText = fileWrapper.find('.field-file__info--text')
		let errorBlock = fileWrapper.find('.file-error')
		let allowedFormats = ['jpeg', 'png', 'docx', 'xlsx', 'pdf']
		let maxSize = 10 * 1024 * 1024

		fileInfoBlock.find('.file-item').remove()

		if (file) {
			let fileExt = file.name.split('.').pop().toLowerCase()

			if (!allowedFormats.includes(fileExt)) {
				errorBlock
					.text(
						'Недопустимый формат файла! Допустимые форматы: JPEG, PNG, DOCX, XLSX, PDF'
					)
					.show()
				$(this).val('')
				instructionText.hide()
				return
			}

			if (file.size > maxSize) {
				errorBlock
					.text(
						'Размер файла превышает 10 МБ! Загрузите файл меньшего размера.'
					)
					.show()
				$(this).val('')
				instructionText.hide()
				return
			}

			errorBlock.hide()

			instructionText.hide()

			fileIconBlock.hide()

			fileInfoBlock.append(`
							<div class="file-item">
									${file.name}
									<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M22.5 7.5L7.5 22.5" stroke="#A1A5AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
										<path d="M7.5 7.5L22.5 22.5" stroke="#A1A5AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
							</div>
					`)
		}
	})

	$('body').on('click', '.file-item svg', function(event) {
		event.preventDefault()
		event.stopPropagation()

		let fileWrapper = $(this).closest('.field-file')
		fileWrapper.find('.file-item').remove()
		fileWrapper.find('.field-file input').val('')
		fileWrapper.find('.field-file__info--text').show()
		fileWrapper.find('.file-error').hide()
		fileWrapper.find('.field-file__icon').show()
	})

	$(document).on('select2:open', () => {
		$('body').addClass('select-close')
	})

	$(document).on('select2:close', () => {
		$('body').removeClass('select-close')
	})

	$('[data-nav-item]').on('click', function() {
		if (!$(this).hasClass('active')) {
			var index = $(this).index()
			$(this).addClass('active').siblings().removeClass('active')
			$('[data-nav-content]').removeClass('active').eq(index).addClass('active')
		}
		return false
	})

	const input = document.querySelector('input[type=number]')

	input.addEventListener('input', () => {
		input.value = input.value.replace(/[^0-9]/g, '')
	})

	$(function() {
		$('[data-mask="date"]').each(function() {
			const el = this
			const min = new Date($(el).data('min'))
			const max = new Date($(el).data('max'))

			IMask(el, {
				mask: Date,
				min: min,
				max: max,
			})
		})
	})



		$('[data-country]').on('change', function() {
		if ($(this).data('resident') === true) {
			$(this)
				.closest('form')
				.find('[data-field="REGION"]')
				.removeClass('disabled')
		} else {
			$(this).closest('form').find('[data-field="REGION"]').addClass('disabled')
		}
	})



	
})
