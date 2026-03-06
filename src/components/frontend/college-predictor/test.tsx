
CollegePredictorTest OG Form

//return (
//     <Card className="mt-2 tab:mx-16 p-7 tab:p-10">
//       <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
//         <div className="space-y-2">
//           <h3 className="text-[25px] pc:text-4xl font-bold text-center">
//             Predict Your College
//           </h3>
//           <p className="text-base text-gray-500 text-center poppinsFont">
//             Enter your details to find the best college matches
//           </p>
//         </div>

//         <SearchAndSelect
//           name="predictor Type"
//           label="Pedictor Type"
//           placeholder="Select Predictor Type"
//           value={formData?.courseType}
//           // isSearchable={false} 
//           onChange={({ name, selectedValue }) => {
//             onOptionSelected(name, selectedValue, setFormData)
//             // console.log(selectedValue)
//             if (selectedValue?.text)
//               getCoursesBasedOncourseType(selectedValue?.text)
//             setFormData((prev) => ({
//               ...prev,
//               courseType: selectedValue,
//               courses:undefined,
//               counsellingType: undefined,
              
//             }))


//             const neetBasedExams = [
//               "NEET UG",
//               "NEET MDS",
//               "NEET SS",
//               "AIAPGET (Ayurveda)",
//             ]

//             if (
//               selectedValue?.text &&
//               neetBasedExams.includes(selectedValue.text)
//             ) {
//               setRadioOption(["Rank", "Marks"])
//             } else {
//               setRadioOption(["Rank", "Percentile"])
//             }
//           }}
//           loading = {isCourseTypeLoading}
//           control={control}
//           setValue={setValue}
//           required
//           options={courseTypeList}
//           debounceDelay={0}
          
//       wrapperClass="w-full"
//           searchAPI={(text, setOptions) =>
//             autoComplete(text, courseTypeList, setOptions)
//           }
//           errors={errors}
//           disableSearch={true}
//         />
//         {/* <SearchAndSelect
//   name="predictorType"
//   label="Predictor Type"
//   placeholder="Select Predictor Type"
//   value={formData?.courseType}
//   onChange={({ name, selectedValue }) => {
//     onOptionSelected(name, selectedValue, setFormData)

//     if (selectedValue?.text)
//       getCoursesBasedOncourseType(selectedValue?.text)

//     setFormData((prev) => ({
//       ...prev,
//       courseType: selectedValue,
//       courses: undefined,
//       counsellingType: undefined,
//     }))

//     const neetBasedExams = [
//       "NEET UG",
//       "NEET MDS",
//       "NEET SS",
//       "AIAPGET (Ayurveda)",
//     ]

//     if (
//       selectedValue?.text &&
//       neetBasedExams.includes(selectedValue.text)
//     ) {
//       setRadioOption(["Rank", "Marks"])
//     } else {
//       setRadioOption(["Rank", "Percentile"])
//     }
//   }}
//   loading={isCourseTypeLoading}
//   control={control}
//   setValue={setValue}
//   required
//   options={courseTypeList}
//   wrapperClass="w-full"
//   errors={errors}
// /> */}


//         <p>What do you have ?</p>

//         <div className="flex space-x-6 mt-[-20px]">
//           {radioOption.map((option) => (
//             <label
//               key={option}
//               className="relative flex items-center space-x-2 cursor-pointer text-color-text"
//             >
//               <input
//                 type="radio"
//                 name="rankOrMarks"
//                 value={option}
//                 checked={selected === option}
//                 onChange={() => setSelected(option)}
//                 className="peer hidden"
//               />
//               <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:bg-orange-500 flex items-center justify-center">
//                 <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:opacity-100 opacity-0 transition-opacity"></div>
//               </div>
//               <span className="peer-checked:text-orange-500 ">{option}</span>
//             </label>
//           ))}
//         </div>

//         <Input
//           name="rank"
//           label={selected || "Rank"}
//           type="number"
//           placeholder={`Enter your ${selected || "Rank"}`}
//           setValue={setValue}
//           value={formData?.rank}
//           onChange={(e) => {
//             onTextFieldChange(e, setFormData)
//             clearErrors("rank")
//           }}
//           control={control}
//           rules={{
//             required: false,
//           }}
//           errors={errors}
//         />
//         <SearchAndSelect
//           name="courses"
//           label="Course"
//           placeholder="Select your Course"
//           value={formData?.courses}
//           onChange={({ name, selectedValue }) => {
//             onOptionSelected(name, selectedValue, setFormData)
//           }}
//           control={control}
//           setValue={setValue}
//           options={coursesList}
//           debounceDelay={0}
//           searchAPI={(text, setOptions) =>
//             autoComplete(text, coursesList, setOptions)
//           }
//           loading={isCourseLoading}
//           errors={errors}
//              wrapperClass="w-full"
//           disabled={isEmpty(formData?.courseType?.text)}
//           disableSearch={true}
          
//         />


//         <SearchAndSelect
//           name="counselling Type"
//           label="Counselling Type"
//           placeholder="Select Counselling Type"
//           value={formData?.counsellingType}
//           onChange={({ name, selectedValue }) => {
//             onOptionSelected(name, selectedValue, setFormData)
      
//             setFormData((prev) => ({
//               ...prev,
//               counsellingType: selectedValue,
//               state: undefined,
//               quotas: undefined,
//               categories: undefined,
//             }))

//             setQuotasList([])
//             setCategoriesList([])
//           }}
//           control={control}
//           setValue={setValue}
//           required
//           options={filteredCounsellingTypeDataList}
//           debounceDelay={0}
//           disabled={!formData?.courseType?.id}
//           defaultOption={defaultValues?.filteredCounsellingTypeDataList}
//           wrapperClass="w-full"
//           searchAPI={(text, setOptions) =>
//             autoComplete(text, filteredCounsellingTypeDataList, setOptions)
//           }
//           errors={errors}
//           disableSearch={true}
          
          
//         />
//         {formData?.counsellingType?.id == 2 && (
//           <SearchAndSelect
//             name="state"
//             label="State"
//             placeholder="Search and Select"
//             value={formData?.state}
           
//             onChange={({ name, selectedValue }) => {
//               onOptionSelected(name, selectedValue, setFormData)

//               setFormData((prev) => ({
//                 ...prev,
//                 state: selectedValue,
//                 quotas: undefined,
//                 categories: undefined,
//                 subQuota: undefined, // <-- Add this
//                 subCategory: undefined, // <-- Add this
//               }))

//               setQuotasList([])
//               setCategoriesList([])
//               setSubQuotasList([]) // <-- Add this
//               setSubCategoriesList([]) // <-- Add this
//             }}
//             loading = {isStateLoading}
//             control={control}
//             setValue={setValue}
//             required
//              disabled={
//                 isStateLoading
//               }
//             options={stateList}
//             debounceDelay={0}
//             defaultOption={defaultValues?.state}
//                wrapperClass="w-full"
//             searchAPI={(text, setOptions) =>
//               autoComplete(text, stateList, setOptions)
//             }
//             errors={errors}
//             disableSearch={true}
//           />
//         )}

//         {isNeetUG && (
//           <div className="flex items-center flex-wrap gap-2">
//             <SearchAndSelect
//               name="quotas"
//               label="Quota"
//               placeholder="Select Quota"
//               value={formData?.quotas}
//               onChange={({ name, selectedValue }) => {
//                 onOptionSelected(name, selectedValue, setFormData)
//                 setFormData((prev) => ({
//                   ...prev,
//                   quotas: selectedValue,
//                   subQuota: undefined,
//                   categories: undefined,
//                   subCategory: undefined,
//                 }))
//                 setCategoriesList([])
//                 setSubCategoriesList([])
//                 const found = quotasList.find((q) => q.id === selectedValue?.id)
//                 const subs = found?.sub_quotas || []
//                 setSubQuotasList(subs)
//               }}
//               control={control}
//               setValue={setValue}
//               required
//               options={quotasList}
//               debounceDelay={0}
//               loading={isQuotaLoading}
//               disabled={
//                 !formData?.courseType?.id ||
//                 !formData?.counsellingType?.id ||
//                 (formData?.counsellingType?.id == 2 && !formData?.state?.id)
//               }
//               defaultOption={defaultValues?.quotas}
//        wrapperClass="w-full"
//               searchAPI={(text, setOptions) =>
//                 autoComplete(text, quotasList, setOptions)
//               }
//               errors={errors}
//               disableSearch={true}
//             />

//           </div>
//         )}

//         {isNeetUG && (
//           <div className="flex items-center flex-wrap gap-2">
//             <SearchAndSelect
//               name="categories"
//               label="Category"
//               placeholder="Select Category"
//               value={formData?.categories}
//               onChange={({ name, selectedValue }) => {
//                 onOptionSelected(name, selectedValue, setFormData)
//                 setFormData((prev) => ({
//                   ...prev,
//                   categories: selectedValue,
//                   subCategory: undefined,
//                 }))
//                 const found = categoriesList.find(
//                   (cat) => cat.id === selectedValue?.id,
//                 )
//                 const subs = found?.otherValues?.sub_categories || []
//                 setSubCategoriesList(subs)
//               }}
//               control={control}
//               setValue={setValue}
//               required
//               options={categoriesList}
//               debounceDelay={0}
//               defaultOption={defaultValues?.categories}
//               loading = {isCategoryLaoding}
//               disabled={!formData?.quotas?.id}
//    wrapperClass="w-full"
//               searchAPI={(text, setOptions) =>
//                 autoComplete(text, categoriesList, setOptions)
//               }
//               errors={errors}
//               disableSearch={true}
//             />
            
//           </div>
//         )}

//         <Button
//           className="mt-6"
//           onClick={onSubmit}
//           // data-tooltip-id={"tooltip"}
//           // data-tooltip-content="Coming Soon"
//           disabled={disableCheck()}
//           // disabled
//         >
//           Predict My College
//         </Button>
//       </form>
//     </Card>
//   )