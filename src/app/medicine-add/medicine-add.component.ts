// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { UserService } from '../servise/user.service';
// import { DatePipe } from '@angular/common';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// interface Medicine {
//   name: string;
//   shape: string;
//   dose: string;
//   fromDate: string;
//   toDate: string;
//   timing: string[];
//   description: string;
//   frequency: string;
// }

// @Component({
//   selector: 'app-medicine-add',
//   templateUrl: './medicine-add.component.html',
//   styleUrls: ['./medicine-add.component.css']
// })
// export class MedicineAddComponent implements OnInit {


//   medicines: { timing: string; dose: string}[] = [{ timing: '', dose: ''}];
//   timingsArray: string[] = [];
//   doseArray: string = '';


//   medicine: Medicine = {
//     name: '',
//     shape: '',
//     fromDate: '',
//     toDate: '',
//     timing: [],
//     description: '',
//     frequency: '',
//     dose: '',
//   };
//   doseOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // Generate dose options dynamically
//   firstFormGroup: FormGroup | any;
//   secondFormGroup: FormGroup | any;

//   constructor(
//     private userService: UserService,
//     private router: Router,
//     private datePipe: DatePipe,
//     private formBuilder: FormBuilder
//   ) {}

//   ngOnInit() {
//     this.firstFormGroup = this.formBuilder.group({
//       name: ['', Validators.required],
//       email: ['', Validators.required]
//     });
//   }

//   addMedicine() {
//     this.medicines.push({ timing: '', dose: '' });
//   }

//   removeMedicine(index: number) {
//     this.medicines.splice(index, 1);
//   }

//   onMedicine() {


//     // Perform any necessary action with the captured medicine details
//     console.log(this.medicine);

//     // Filter out empty strings from the timings array
//     this.medicine.timing = this.timingsArray.filter(timing => timing !== '');
//     this.medicine.dose = this.doseArray;
//     // this.medicine.dose = this.doseArray.filter(dose => dose !== '');


//     // Call the API to save the medicine details
//     this.userService.medicineAdd(this.medicine).subscribe(
//       (response: any) => {
//         // Registration successful, do something with the response
//         console.log('Add successful', response);
//         this.router.navigate(['/medicine-history']);
//         // Redirect to a success page or perform any other action
//       },
//       (error: any) => {
//         // Registration failed, handle the error
//         console.error('Error occurred during add', error);
//         if (error.status === 403) {
//           // Access forbidden
//           console.error('Access forbidden. Check permissions or authentication.');
//         } else {
//           // Other error occurred
//           console.error('An error occurred while adding the medicine.', error);
//         }
//         // Display an error message or perform any other action
//       }
//     );
//   }

//   formatfromDate(date: string | null): string {
//     if (date) {
//       const parsedDate = new Date(date);
//       const year = parsedDate.getFullYear();
//       const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
//       const day = ('0' + parsedDate.getDate()).slice(-2);
//       return `${year}-${month}-${day}`;
//     }
//     return '';
//   }

//   formattoDate(date: string | null): string {
//     if (date) {
//       const parsedDate = new Date(date);
//       const year = parsedDate.getFullYear();
//       const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
//       const day = ('0' + parsedDate.getDate()).slice(-2);
//       return `${year}-${month}-${day}`;
//     }
//     return '';
//   }



// }


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../servise/auth.service';
import Swal from 'sweetalert2';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Medicine {
  name: string;
  shape: string;
  dose: string[];
  fromDate: string;
  toDate: string;
  timing: string[];
  description: string;
  frequency: string[];
}



@Component({
  selector: 'app-medicine-add',
  templateUrl: './medicine-add.component.html',
  styleUrls: ['./medicine-add.component.css']
})
export class MedicineAddComponent implements OnInit {





  medicines: { timing: string; dose: string }[] = [{ timing: '', dose: '' }];
  timingsArray: string[] = [];
  doseArray: string[] = [];


  medicine: Medicine = {
    name: '',
    shape: '',
    fromDate: '',
    toDate: '',
    timing: [],
    description: '',
    frequency: [],
    dose: [],
  };
  // doseOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 0.5); // Generate dose options dynamically
  doseOptions: number[] = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 8.5, 9.0, 9.5, 10.0]; // Generate dose options dynamically
  // firstFormGroup: FormGroup | any;
  // secondFormGroup: FormGroup | any;


  frequencyOptions = ['Everyday', 'Every X day', 'Every X day of week', 'Every X day of month'];
  selectedFrequency: string | any;
  everydayOptions = ['everyday'];
  intervalOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  weekOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  monthOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  // selectedInterval: string[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  myControl = new FormControl('');
  options: string[] = [
    "Aspirin",
    "Ibuprofen",
    "Paracetamol",
    "Acetaminophen",
    "Amoxicillin",
    "Ciprofloxacin",
    "Lisinopril",
    "Metformin",
    "Atorvastatin",
    "Omeprazole",
    "Abilify",
"Abilify Maintena",
"Abiraterone",
"Acetaminophen",
"Acetylcysteine",
"Actemra",
"Actos",
"Acyclovir",
"Adderall",
"Adderall XR",
"Advair Diskus",
"Advil",
"Afinitor",
"Aimovig",
"Ajovy",
"Albuterol",
"Aldactone",
"Alecensa",
"Alendronate",
"Aleve",
"Alfuzosin",
"Allegra",
"Allopurinol",
"Alprazolam",
"Alunbrig",
"Amantadine",
"Ambien",
"Ambroxol",
"Amiodarone",
"Amitriptyline",
"Amlodipine",
"Amoxicillin",
"Amoxicillin and Clavulanate",
"Ampicillin",
"Anastrozole",
"AndroGel",
"Annovera",
"Apalutamide",
"Apixaban",
"Apokyn",
"Apriso",
"Aptiom",
"Aricept",
"Arikayce",
"Arimidex",
"Aripiprazole",
"Aristada",
"Aromasin",
"Aspirin",
"Atarax",
"Atenolol",
"Ativan",
"Atogepant",
"Atomoxetine",
"Aubagio",
"Augmentin",
"Austedo",
"Auvelity",
"Avsola",
"Azathioprine",
"Azelastine",
"Azilect",
"Azithromycin",
"Azulfidine",
"A/B Otic",
    "Abacavir",
    "Abacavir and lamivudine",
    "Abacavir and Lamivudine Tablets",
    "Abacavir Oral Solution",
    "Abacavir Sulfate Tablets",
    "Abacavir, dolutegravir, and lamivudine",
    "Abacavir, Lamivudine and Zidovudine Tablets",
    "Abacavir, lamivudine, and zidovudine",
    "Abaloparatide",
    "Abametapir",
    "Abatacept",
    "Abatuss DMX",
    "Abavite",
    "Abbokinase",
    "Abciximab",
    "Abecma",
    "Abelcet",
    "Abemaciclib",
    "Abilify",
    "Abilify (Aripiprazole Intramuscular)",
    "Abilify (Aripiprazole Oral)",
    "Abilify Asimtufii",
    "Abilify Discmelt",
    "Abilify Maintena",
    "Abilify Mycite",
    "Abilify MyCite Maintenance Kit oral with sensor",
    "Abilify MyCite Starter Kit oral with sensor",
    "Abiraterone",
    "Abiraterone Acetate",
    "Abiraterone, micronized",
    "Ablavar",
    "Ablysinol",
    "AbobotulinumtoxinA",
    "Abraxane",
    "Abreva",
    "ABRILADA",
    "Abrocitinib",
    "Abrysvo",
    "Absorbine Athletes Foot",
    "Absorbine Jr. Antifungal",
    "Absorica",
    "Absorica LD",
    "Abstral",
    "Abstral Sublingual Tablet",

    "A-Caro-25",
    "Acacia Gum",
    "Acai",
    "Acalabrutinib",
    "ACAM2000",
    "Acamprosate",
    "Acanya",
    "Acarbose",
    "Accelerated Covid-19 Test Kit",
    "AccessPak for HIV PEP Basic",
    "AccessPak for HIV PEP Expanded with Kaletra",
    "AccessPak for HIV PEP Expanded with Viracept",
    "Acclean",
    "Acclean 60 Second Fluoride Treatment",
    "Acclean Plus",
    "Accolate",
    "Accretropin",
    "Accrufer",
    "Accucaine",
    "Accuneb",
    "Accupril",
    "Accuretic",
    "Accutane",
    "ACD A",
    "ACD Blood Pack Units",
    "Acebutolol",
    "Acella Antipyrine and Benzocaine Otic Solution",
    "Aceon",
    "Acephen",
    "Acephen rectal",
    "Acerola",
    "Acetadote",
    "Acetaminophen",
    "Acetaminophen (Intravenous)",
    "Acetaminophen (Oral, Rectal)",
    "Acetaminophen and benzhydrocodone",
    "Acetaminophen and butalbital",
    "Acetaminophen and caffeine",
    "Acetaminophen and chlorpheniramine",
    "Acetaminophen and codeine",
    "Acetaminophen and Codeine Oral Solution",
    "Acetaminophen and dextromethorphan",
    "Acetaminophen and diphenhydramine",
    "Acetaminophen and ibuprofen",
    "Acetaminophen and Oxycodone",
    "Acetaminophen and phenylephrine",
    "Acetaminophen and phenyltoloxamine",
    "Acetaminophen and pseudoephedrine",
    "Acetaminophen and tramadol",
    "Acetaminophen injection",
    "Acetaminophen rectal",
    "Acetaminophen, aspirin, and caffeine",
    "Acetaminophen, butalbital, and caffeine",
    "Acetaminophen, butalbital, caffeine, and codeine",
    "Acetaminophen, caffeine, and dihydrocodeine",
    "Acetaminophen, caffeine, and magnesium salicylate",
    "Acetaminophen, chlorpheniramine, and dextromethorphan",
    "Acetaminophen, chlorpheniramine, and phenylephrine",
    "Acetaminophen, chlorpheniramine, dextromethorphan, and pseudoephedrine",
    "Acetaminophen, dextromethorphan, and diphenhydramine",
    "Acetaminophen, dextromethorphan, and doxylamine",
    "Acetaminophen, dextromethorphan, and phenylephrine",
    "Acetaminophen, dextromethorphan, and triprolidine",
    "Acetaminophen, dextromethorphan, doxylamine, and phenylephrine",
    "Acetaminophen, dextromethorphan, doxylamine, and pseudoephedrine",
    "Acetaminophen, dextromethorphan, guaifenesin, and phenylephrine",
    "Acetaminophen, dextromethorphan, guaifenesin, and pseudoephedrine",
    "Acetaminophen, dextromethorphan, phenylephrine, and triprolidine",
    "Acetaminophen, diphenhydramine, and phenylephrine",
    "Acetaminophen, magnesium salicylate, and pamabrom",
    "Acetaminophen, pamabrom, and pyrilamine",
    "Acetaminophen, pheniramine, and phenylephrine",
    "Acetasol HC",
    "Acetasol HC otic",
    "Acetazolamide",
    "Acetazolamide (Intravenous)",
    "Acetazolamide (Oral)",
    "Acetazolamide Capsules",
    "Acetazolamide Tablets",
    "Acetic Acid",
    "Acetic acid and hydrocortisone otic",
    "Acetic acid irrigant",
    "Acetic Acid Irrigation",
    "Acetic acid otic",
    "Acetic acid vaginal",
    "Acetohydroxamic acid",
    "Acetone, isopropyl alcohol, and polysorbate",
    "Acetylcysteine",
    "Acetylcysteine (Intravenous)",
    "Acetylcysteine (Oral)",
    "Acetylcysteine inhalation",
    "Acetylcysteine Injection",
    "Acetylcysteine Solution",
    "Achromycin V",
    "Aci-Jel vaginal",
    "Acid Controller Original Strength",
    "Acid Gone",
    "Acid Gone Extra Strength",
    "Acid Jelly vaginal",
    "Acidic Vaginal Jelly vaginal",
    "Acidophilus",
    "Aciphex",
    "AcipHex Sprinkle",
    "Acitretin",
    "Acitretin Capsules",
    "Ackee",
    "Aclasta",
    "Aclidinium",
    "Aclidinium and formoterol",
    "Aclovate",
    "Acne",
    "Acne 10 Gel",
    "Acne Wash",
    "Acne-Clear",
    "Acnevir",
    "Acomplia",
    "Aconite",
    "Acrivastine and pseudoephedrine",
    "ACT COVID-19 Antibody Test",
    "ACT Fluoride Rinse",
    "Actamin",
    "Actamin Maximum Strength",
    "Actemra",
    "Actemra ACTPen",
    "Acthar Gel, H.P.",
    "ActHIB",
    "Acthrel",
    "Acticin",
    "Acticlate",
    "Actidose",
    "Actidose-Aqua",
    "Actifed",
    "Actifed Cold & Allergy",
    "Actigall",
    "Actimmune",
    "Actiq",
    "Actisite",
    "Activase",
    "Activated charcoal",
    "Activella",
    "ActivICE",
    "Actonel",
    "Actonel with Calcium",
    "Actoplus Met",
    "Actoplus Met XR",
    "Actos",
    "Acuflex",
    "Acular",
    "Acular LS",
    "Acular PF",
"Acunivive 15 Injection System",
"Acunivive 30 Injection System",
"Acunivive 60 Injection System",
"Acunivive 90 Injection System",
"Acunol",
"Acuvail",
"Acuvue Theravision with Ketotifen",
"Acyclovir",
"Acyclovir (Buccal mucosa)",
"Acyclovir (Ophthalmic)",
"Acyclovir (Oral, Intravenous)",
"Acyclovir (Systemic)",
"Acyclovir and hydrocortisone",
"Acyclovir and hydrocortisone topical",
"Acyclovir Capsules",
"Acyclovir Cream",
"Acyclovir injection",
"Acyclovir IV Infusion",
"Acyclovir Ointment",
"Acyclovir Oral Suspension",
"Acyclovir Tablets",
"Acyclovir topical",
"Acys-5",
"Aczone",

"Adacel",
"Adacel Tdap",
"Adagen",
"Adagrasib",
"Adakveo",
"Adakveo Injection",
"Adalat CC",
"Adalimumab",
"Adalimumab Injection",
"Adalimumab-aacf",
"Adalimumab-aaty",
"Adalimumab-adaz",
"Adalimumab-adbm",
"Adalimumab-afzb",
"Adalimumab-aqvh",
"Adalimumab-atto",
"Adalimumab-bwwd",
"Adalimumab-fkjp",
"Adapalene",
"Adapalene and benzoyl peroxide",
"Adapalene and Benzoyl Peroxide Gel",
"Adapalene and benzoyl peroxide topical",
"Adapalene Cream",
"Adapalene Solution",
"Adapalene topical",
"Adasuve",
"Adbry",
"Adcetris",
"Adcirca",
"Addamel N",
"Addaprin",
"Adderall",
"Adderall XR",
"Additive Formula 3",
"Addyi",
"Adefovir",
"Adefovir Dipivoxil",
"Adempas",
"Adempas Tablets",
"Adenocard",
"Adenoscan",
"Adenosine",
"Adenovirus Type 4-and Type-7 Vaccine Live",
"Adenovirus Vaccine",
"Adenovirus vaccine, live",
"Adhansia XR",
"Adipex-P",
"Adlarity",
"Adlyxin",
"Admelog",
"Ado-trastuzumab emtansine",
"Adoxa CK",
"Adoxa Pak",
"Adoxa TT",
"Adrenaclick",
"Adrenalin",
"Adrenalin (Epinephrine Inhalation)",
"Adrenalin (Epinephrine Injection)",
"Adrenalin Chloride",
"Adrenalin Injection",
"AdreView",
"Adriamycin",
"Adrucil",
"Adrucil injection",
"Adsol Red Cell Preservation System",
"Adstiladrin",
"Adthyza",
"Aducanumab",
"Aducanumab-avwa",
"Aduhelm",
"Advair",
"Advair Diskus",
"Advair Diskus 100/50",
"Advair Diskus 250/50",
"Advair Diskus 500/50",
"Advair HFA",
"Advair HFA 115/21",
"Advair HFA 230/21",
"Advair HFA 45/21",
"Advanced Eye Relief Dry Eye",
"Advantage Multi for Dogs",
"Advate",
"Advicor",
"Advil",
"Advil Allergy Sinus",
"Advil Childrens",
"Advil Childrens Allergy Sinus",
"Advil Cold & Sinus",
"Advil Cold and Sinus Liqui-Gel",
"Advil Dual Action With Acetaminophen",
"Advil Infants Concentrated Drops",
"Advil Liqui-Gels",
"Advil Migraine",
"Advil Multi-Symptom Cold",
"Advil PM",
"Advil PM Liqui-Gels",
"Advil Sinus Congestion & Pain",
"Adynovate",
"Adynovate recombinant",
"Adyphren",
"Adyphren II",
"Adzenys ER",
"Adzenys ER Oral Suspension",
"Adzenys XR-ODT",

"Aemcolo",
"Aerobid",
"Aerobid-M",
"Aerospan",

"Afamelanotide",
"Afatinib",
"Afeditab CR",
"Affodel",
"Afinitor",
"Afinitor Disperz",
"Afirmelle",
"Aflaxen",
"Aflibercept",
"Aflibercept ophthalmic",
"Afluria",
"Afluria 2015-2016 Formula",
"Afluria PF Pediatric Quadrivalent 2021-2022 injection",
"Afluria PF Quadrivalent 2021-2022 injection",
"Afluria Quadrivalent",
"Afluria Quadrivalent 2021-2022 injection",
"Afrezza",
"African Basil",
"African Mango",
"Afrin",
"Afrin 4 Hour Extra Moisturizing",
"Afrin No Drip Sinus",
"Afrin Saline nasal",
"Afstyla",
"Afstyla recombinant",
"Aftate",
"AfterPill",

"A-G Profen",
"Agalsidase beta",
"Aggrastat",
"Aggrenox",
"AgonEaze",
"Agriflu",
"Agrimony",
"Agrylin",

"A-Hydrocort",
"AH-Chew II",
"AHCC",

"A-G Profen",
"Agalsidase beta",
"Aggrastat",
"Aggrenox",
"AgonEaze",
"Agriflu",
"Agrimony",
"Agrylin",
"Aimovig",
"Aimovig SureClick Autoinjector",
"Air",
"Air Compressed",
"AirDuo Digihaler",
"AirDuo Digihaler with eModule",
"AirDuo RespiClick",
"Airsupra",
"Airsupra inhalation",
"Aivlosin",
"Ajovy",
"Ajovy Injection",
"AK-Con",
"AK-Dilate",
"AK-Fluor",
"AK-NaCl",
"AK-Pentolate",
"AK-Poly-Bac",
"AK-Pred",
"AK-Taine",
"Akineton",
"Aklief",
"Aklief Cream",
"Akne-Mycin",
"Akne-mycin Ointment",
"Akovaz",
"Akten",
"Akten Gel",
"Aktipak",
"AKTob",
"Akurza",
"Akwa Tears",
"Akynzeo",
"Akynzeo (Fosnetupitant/palonosetron Intravenous)",
"Akynzeo (Netupitant and palonosetron Oral)",
"Akynzeo for injection",
"Ala Hist IR",
"Ala Hist PE",
"Ala Quin Cream",
"Ala Scalp",
"Ala-Cort",
"Ala-Cort Cream",
"Ala-Scalp HP",
"Ala-Scalp Lotion",
"Ala-Tet",
"Alahist CF",
"Alahist D",
"Alahist DM",
"Alamast",
"Alavert",
"Alavert D-12",
"Alavert D-12 Hour Allergy and Sinus",
"Alavert-D 12-Hour",
"Alaway",
"Albalon",
"Albendazole",
"Albenza",
"Albiglutide",
"Albuked",
"Albuked 25",
"Albuked 5",
"Albuked human",
"Albumarc",
"Albumin (Human) 20%",
"Albumin human",
"Albuminar",
"Albuminar-25",
"Albuminar-25 human",
"Albuminex Injection",
"Alburx",
"Alburx human",
"Albutein",
"Albutein 25%",
"Albutein 5%",
"Albutein human",
"Albuterol",
"Albuterol (Inhalation)",
"Albuterol (Oral)",
"Albuterol Aerosol",
"Albuterol and budesonide",
"Albuterol and budesonide inhalation",
"Albuterol and ipratropium inhalation",
"Albuterol Extended-Release Tablets",
"Albuterol Inhalation Solution",
"Albuterol Oral Solution",
"Albuterol Syrup",
"Alcaftadine",
"Alcaftadine ophthalmic",
"Alcaine",
"Alclometasone",
"Alclometasone Ointment",
"Alclometasone topical",
"Alcohol",
"Alcohol and Dextrose",
"Alcohol in Dextrose",
"Alcon Tears",
"Alcortin A Gel",
"Alcortin A topical",
"Aldactazide",
"Aldactone",
"Aldara",
"Aldesleukin",
"Aldex G",
"Aldomet",
"Aldoril",
"Aldurazyme",
"Alecensa",
"Alectinib",
"Alefacept",
"Alemtuzumab",
"Alendronate",
"Alendronate and cholecalciferol",
"Alendronate Oral Solution",
"Alera",
"Alert",
"Alesse",
"Alesse-28",
"Aletris",
"Aleve",
"Aleve Arthritis",
"Aleve Cold and Sinus",
"Aleve PM",
"Aleve Sinus & Headache",
"Aleve-D Sinus & Cold",
"Alfalfa",
"Alfentanil",
"Alferon N",
"Alfuzosin",
"Alfuzosin Tablets",
"Alglucerase",
"Alglucosidase alfa",
"Alglucosidase alfa injection",
"Aliclen",
"Alimta",
"Alinia",
"Aliqopa",
"Alirocumab",
"Aliskiren",
"Aliskiren and amlodipine",
"Aliskiren and hydrochlorothiazide",
"Aliskiren Tablets",
"Aliskiren, amlodipine, and hydrochlorothiazide",
"Alitretinoin",
"Alitretinoin topical",
"Alivio",
"Alka-Seltzer",
"Alka-Seltzer Anti-Gas",
"Alka-Seltzer Cold and Sinus",
"Alka-Seltzer Morning Relief",
"Alka-Seltzer Plus Cold",
"Alka-Seltzer Plus Cold and Cough",
"Alka-Seltzer Plus Cold and Sinus",
"Alka-Seltzer Plus Cold Formula",
"Alka-Seltzer Plus Night-Time Cold",
"Alkanna Root",
"Alkeran",
"Alkeran IV",
"Alkeran Tablets",
"Alkindi Sprinkle",
"All Day Allergy-D",
"All Day Pain Relief",
"All Day Relief",
"All-Nite",
"Allan Tannate Pediatric",
"Allanhist PDX Drops",
"Allegra",
"Allegra 12 Hour Allergy",
"Allegra 24 Hour Allergy",
"Allegra Allergy",
"Allegra ODT",
"Allegra OTC",
"Allegra-D",
"Allegra-D 12 hour",
"Allegra-D 24 Hour",
"Aller-Chlor",
"Aller-Ease",
"AllerDur",
"Allerest 12 Hour Nasal Spray",
"Allerest Maximum Strength",
"Allerest No Drowsiness",

"Allerest PE",
"Allergenic Extract, Bee and Wasp",
"Allergenic Extract, Coca Glycerine",
"Allergenic Extract, Standardized Mites",
"Allergenic Extracts Injection",
"Allergenic Extracts, Grass",
"Allergenic Extracts, Grass Pollen",
"Allergy & Congestion Relief",
"Allergy Relief",
"Allergy Relief (Fexofenadine HCl)",
"Allergy Relief D",
"Allermax",
"AllerNaze",
"Allersol",
"Allfen",
"Allfen C",
"Allfen CD",
"Allfen CX",
"Alli",
"AlloPAX",
"Allopurinol",
"Allopurinol (Intravenous)",
"Allopurinol (Oral)",
"Allopurinol Injection",
"Allspice",
"Allzital",
"Almacone",
"Almond/Almond Oil",
"Almotriptan",
"Alocril",
"Alodox",
"Aloe",
"Aloe Grande topical",
"Aloe polysaccharides, hydrocortisone, and iodoquinol topical",
"Aloe vera topical",
"Aloe Vesta 2-N-1 Antifungal",
"Aloe Vesta Antifungal",
"Alogliptin",
"Alogliptin and metformin",
"Alogliptin and Metformin Tablets",
"Alogliptin and pioglitazone",
"Alogliptin and Pioglitazone Tablets",
"Alomide",
"Aloprim",
"Aloquin Gel",
"Alora",
"Alora skin patch",
"Alosetron",
"Aloxi",
"Aloxi Capsules",
"Alpelisib",
"Alpha 1-proteinase inhibitor",
"Alpha-1 proteinase inhibitor human",
"Alpha-E",
"Alpha-lipoic acid",
"Alpha-Pro Gel",
"Alphagan P",
"Alphanate",
"Alphanine SD",
"Alphatrex",
"Alprazolam",
"Alprazolam Extended Release",
"Alprazolam Intensol",
"Alprazolam ODT",
"Alprazolam XR",
"Alprolix",
"Alprolix (Factor ix fc fusion protein recombinant Intravenous)",
"Alprolix (Factor ix Intravenous, Injection)",
"Alprostadil",
"Alprostadil (Intracavernosal)",
"Alprostadil (Intravenous)",
"Alprostadil (Urethral)",
"Alprostadil injectable and transurethral",
"Alrex",
"Alrex ophthalmic",
"Alsuma",
"Altacax",
"Altacaine",
"Altacaine Ophthalmic Solution",
"Altace",
"Altachlore ophthalmic",
"Altaflor",
"Altafluor",
"Altafrin",
"Altamist nasal",
"Altarussin",
"Altarussin CF",
"Altavera",
"Altazine",
"Altenol",
"Alteplase",
"Alteplase, recombinant",
"Altocor",
"Altoprev",
"Altreno",
"Altretamine",
"Altuviiio",
"Altuviiio (Antihemophilic factor (recombinant), fc-vwf-xten fusion protein-ehtl Intravenous)",
"Altuviiio (Antihemophilic factor Intravenous)",
"Aluminum Acetate",
"Aluminum Chloride (Topical)",
"Aluminum chloride hexahydrate topical",
"Aluminum hydroxide",
"Aluminum hydroxide and magnesium carbonate",
"Aluminum hydroxide and magnesium trisilicate",
"Aluminum hydroxide, magnesium hydroxide, and simethicone",
"Alunbrig",
"Alupent",
"Alupent (Metaproterenol Inhalation)",
"Alupent (Metaproterenol Oral)",
"Aluvea",
"Alvesco",
"Alvesco HFA inhalation",
"Alvimopan",
"Alyacen 7/7/7",
"Alyacen 1/35",
"Alymsys",
"Alymsys (Bevacizumab Intravenous)",
"Alymsys (Bevacizumab-maly Intravenous)",
"Alyq"

  ];
  filteredOptions: Observable<string[]> | any;


  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));

  }

  addMedicine() {
    this.medicines.push({ timing: '', dose: '' });
    this.timingsArray.push('');
    this.doseArray.push('');
  }

  removeMedicine(index: number) {
    this.medicines.splice(index, 1);
    this.timingsArray.splice(index, 1);
    this.doseArray.splice(index, 1);
  }



  onMedicine() {
    // Perform any necessary action with the captured medicine details
    console.log(this.medicine);

    // Filter out empty strings from the timings array
    this.medicine.timing = this.timingsArray.filter(timing => timing !== '');

    // Convert the array of doses to a Set
    this.medicine.dose = Array.from(this.doseArray);

    // Call the API to save the medicine details
    this.userService.medicineAdd(this.medicine).subscribe(
      (response: any) => {
        // Registration successful, show success message
        Swal.fire({
          title: 'Success',
          text: 'Medicine added successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result) {
            this.router.navigate(['/medicine-history']);
            // Redirect to a success page or perform any other action
          }
        });
      },
      (error: any) => {
        // Registration failed, handle the error
        console.error('Error occurred during add', error);
        if (error.status === 403) {
          // Access forbidden
          console.error('Access forbidden. Check permissions or authentication.');
        } else {
          // Other error occurred
          console.error('An error occurred while adding the medicine.', error);
        }
        // Display an error message or perform any other action
      }
    );
  }

  formatfromDate(date: string | null): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  formattoDate(date: string | null): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  minDate(): string {
    return this.authService.setMinDate();
  }


}

