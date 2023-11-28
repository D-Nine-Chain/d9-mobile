import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { MerchantService } from 'app/services/contracts/merchant/merchant.service';
import { D9Balances, D9QrCode, GreenPointsAccount, MerchantQrCode, USDTAllowanceRequest } from 'app/types';
import { substrateAddressValidator } from 'app/utils/Validators';
import { Subscription, combineLatest } from 'rxjs';
import { MerchantQrComponent } from '../merchant-qr/merchant-qr.component';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { AllowanceRequestComponent } from 'app/modals/allowance-request/allowance-request/allowance-request.component';
import { environment } from 'environments/environment';
import { WalletService } from 'app/services/wallet/wallet.service';
import { faCircleUp, faCircleDown } from '@fortawesome/free-solid-svg-icons';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { AssetsService } from 'app/services/asset/asset.service';
import { QrCodeService } from 'app/services/qr-code/qr-code.service';

@Component({
   selector: 'app-merchant-account',
   templateUrl: './merchant-account.component.html',
   styleUrls: ['./merchant-account.component.scss'],
})
export class MerchantAccountComponent implements OnInit {
   @ViewChild('qrCodeContainer') qrCodeContainer!: ElementRef;

   countDownConfig = {
      format: 'HH:mm:ss',
      leftime: 100,
   }//5ExhaCtuNL66rdpJNqRoHBszCyMhz4y7rFboxpLUzB5itRDi
   loading: any;
   countdown = "";
   currentModal: any = null;
   usdtBalance = 0;
   usdtAllowance = 0;
   accelerateRedPoints = 0;
   redPoints = 0;
   calculationVisible = false;
   subs: Subscription[] = []
   sendArrow = faCircleUp;
   receiveArrow = faCircleDown;
   sentGreenPoints: number | string = 0;
   receivedGreenPoints: number | string = 0;
   tokensConsumed: number | string = 0;
   d9FreeBalance: number = 0;
   expirySub: Subscription | null = null;
   expiry: number | null = null;
   activeAddress: string | null = null;
   paymentMethod = new FormControl('USDT', [Validators.required]);
   numberOfMonths = new FormControl(0, [Validators.required, Validators.min(1), this.monthsValidator()]);
   amountToGreenPoints = new FormControl(1, [Validators.required, Validators.min(1), this.amountToGreenPointsValidator()]);
   toAddress = new FormControl('', [Validators.required, substrateAddressValidator()]);
   constructor(private merchantService: MerchantService, private loadingController: LoadingController, public modalController: ModalController, private usdt: UsdtService, private wallet: WalletService, private assets: AssetsService, private qrcode: QrCodeService) {

   }
   ngAfterViewInit() {

   }
   async ngOnInit() {
      let addressSub = this.wallet.activeAddressObservable().subscribe((address) => {
         console.log("address is ", address)
         this.activeAddress = address;
         this.generateQrCode();
      })
      this.subs.push(addressSub)
      this.expirySub = this.merchantService.merchantExpiryObservable().subscribe((expiry) => {

         console.info("expiry is ", expiry)
         this.expiry = expiry
         if (this.expiry != null) {
            this.countdownToFutureDate(this.expiry)
            this.generateQrCode();
         }

      })
      this.subs.push(this.expirySub)
      this.loading = await this.loadingController.create({
         message: "Loading..."
      })
      let d9balanceSub = this.assets.d9BalancesObservable().subscribe((d9Balances: D9Balances) => {
         this.d9FreeBalance = d9Balances.free as number

      })

      this.subs.push(d9balanceSub)

      let balanceAllowanceSub = combineLatest([this.usdt.allowanceObservable(environment.contracts.merchant.address),
      this.usdt.balanceObservable()])
         .subscribe(([allowance, balance]) => {
            console.log(`allowance is e is ${allowance} and balance is ${balance}`)
            if (allowance != null) {
               this.usdtAllowance = allowance;
               this.usdtBalance = balance;
            }
         })
      this.subs.push(balanceAllowanceSub)

      let inputSub = this.amountToGreenPoints.valueChanges.subscribe((value) => {
         if (value != null) {
            this.calculateGreenPoints(value)
            this.tokensConsumed = value;
            if (value > 0) {
               this.calculationVisible = true;
            } else {
               this.calculationVisible = false;
            }
         } else {
            this.calculationVisible = false;
         }
      })
      this.subs.push(inputSub)
   }



   ngOnDestroy() {
      this.subs.forEach((sub) => {
         sub.unsubscribe();
      })
   }

   getCurrencyIcon() {
      if (this.paymentMethod.value == "USDT") {
         return this.assets.getAssetIcon(CurrencyTickerEnum.USDT)
      } else if (this.paymentMethod.value == "D9") {
         return this.assets.getAssetIcon(CurrencyTickerEnum.D9)
      }
      else {
         return ""
      }
   }

   showBalance() {
      if (this.paymentMethod.value == "USDT") {
         return this.usdtBalance
      } else if (this.paymentMethod.value == "D9") {
         return this.d9FreeBalance
      } else {
         return 0
      }
   }
   async openMerchantQrModal() {
      this.currentModal = await this.modalController.create({
         component: MerchantQrComponent,
      });
      return await this.currentModal.present();
   }

   async openAllowanceModal() {
      const data: USDTAllowanceRequest = {
         'address': environment.contracts.merchant.address,
         'name': environment.contracts.merchant.name,

      }
      await this.openModal(AllowanceRequestComponent, data)
   }

   /**
    * Subscribes to the merchant account for a specified number of months.
    */
   subscribe() {
      if (this.numberOfMonths.valid) {
         const months = this.numberOfMonths.value!;
         this.merchantService.subscribe(months);
      }
   }

   showError() {
      if (this.numberOfMonths) {
         const errors = this.numberOfMonths.errors;

      }
   }

   calculateGreenPoints(usdtAmount: number) {
      const greenPoints = this.merchantService.calculateGiveGreenPoints(usdtAmount)
      this.sentGreenPoints = greenPoints.consumer;
      this.receivedGreenPoints = greenPoints.merchant;
   }

   showCalc() {
      this.calculationVisible = !this.calculationVisible
   }

   async moreAllowance() {
      await this.openAllowanceModal();
   }

   async openModal(component: any, data?: any) {
      this.currentModal = await this.modalController.create({
         component: component,
      });
      if (data) {
         this.currentModal.componentProps = data;
      }
      return await this.currentModal.present();
   }
   sendGreenPoints() {
      console.log("sending green points")
      if (this.amountToGreenPoints.valid && this.toAddress.valid, this.paymentMethod.valid) {
         const amount = this.amountToGreenPoints.value!;
         const address = this.toAddress.value!;
         if (this.paymentMethod.value == "USDT") {
            this.merchantService.giveGreenPoints(address, amount, CurrencyTickerEnum.USDT)
         }
         else if (this.paymentMethod.value == "D9") {
            console.log(`sending ${amount} d9`)
            this.merchantService.giveGreenPoints(address, amount, CurrencyTickerEnum.D9)
         }
      }
   }

   disableSendButton() {
      return this.amountToGreenPoints.invalid || this.toAddress.invalid || this.paymentMethod.invalid;
   }

   isMerchantAccount() {
      if (this.expiry != null) {
         return new Date(this.expiry).getTime() > Date.now()
      }
      return false;
   }


   amountToGreenPointsValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         const amount = control.value;
         if (this.paymentMethod.value == "USDT") {
            return amount > this.usdtBalance ? { 'insufficientFunds': { value: control.value } } : null;
         }
         else if (this.paymentMethod.value == "D9") {
            return amount > this.d9FreeBalance ? { 'insufficientFunds': { value: control.value } } : null;
         }
         return null;
      };
   }

   monthsValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         const months = control.value;
         return months * 10 > this.usdtAllowance ? { 'insufficientAllowance': { value: control.value } } : null;
      };
   }

   balanceValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return this.usdtBalance > control.value ? null : { 'insufficientFunds': { value: control.value } };
      }
   }

   formatNumber(number: string | number) {
      const num = typeof number == "string" ? parseFloat(number) : number;
      return Utils.formatNumberForUI(num, "short", "compact")
   }

   countdownToFutureDate(futureDate: number) {
      const interval = setInterval(() => {
         const currentTime = new Date().getTime();
         const timeDifference = futureDate - currentTime;

         if (timeDifference <= 0) {
            clearInterval(interval);
            console.log('Countdown finished!');
            return;
         }

         // Calculate days, hours, minutes, and seconds
         const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
         const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
         const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
         this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      }, 1000);
   }

   generateQrCode() {
      console.log("called generate qr code")
      console.log("active address is ", this.activeAddress)
      console.log("expiry is ", this.expiry)
      console.log("qr code container is ", this.qrCodeContainer)
      if (this.activeAddress != null && this.expiry != null && this.qrCodeContainer != undefined) {
         console.log("generating qr code")
         const merchantQrCode: MerchantQrCode = {
            accountId: this.activeAddress,
            validUntil: this.expiry,
         }
         const d9QrCode: D9QrCode = {
            type: 'Merchant',
            data: merchantQrCode,
            version: 1,
            metadata: {
               timestamp: new Date().getTime(),
            }
         }
         this.qrcode.generateQRCodeToFile(d9QrCode)
            .then((canvas) => {
               if (canvas) {
                  this.qrCodeContainer.nativeElement.innerHTML = '';
                  this.qrCodeContainer.nativeElement.appendChild(canvas);
               }
            })
            .catch((err) => {
               console.log("err is in creating QRcode caught in component ", err)
            })
      }

   }
}

