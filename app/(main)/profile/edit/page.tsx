'use client'

import { InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { UserService } from '../../../../service/UserService';
import AppMessages,  {AppMessage} from '../../../../components/AppMessages'
import { useEffect, useRef } from 'react';

const EditProfile = () => {
    const {control, formState: { errors, isDirty }, handleSubmit, reset} = useForm<Tutor>({ defaultValues: { firstName: '', lastName: '', educationLevel: '', tuitionCentre: '' } });
    const appMsg = useRef<AppMessage>(null);

    useEffect(() => {
        UserService.getTutorProfile().then((data) => {
            reset(data);
        })
    },[]);
    const onSubmit = (data: Tutor) => {
        UserService.updateTutorProfile(data).then((data) => {
            console.log("Saved outout",data);
            reset(data);
            appMsg.current?.showSuccess('Profile updated successfully');
        });
    }
    return (
        <div className="grid">
            <AppMessages ref={appMsg} />
            <h5 className='col-12'>Profile</h5>
            <form onSubmit={handleSubmit(onSubmit)} className='col-12'>
                <div className="col-12">
                <Controller name="firstName" control={control} rules={{ required: 'First name is required', maxLength:{value:100, message: 'Max length is 100' }}} 
                    render={({ field, fieldState }) => 
                        <InputText  id={field.name} {...field} autoFocus placeholder="First Name" size={50} />} 
                />
                </div>
                <div className="col-12"><span className='p-error'>{errors.firstName?.message} </span></div>
                <div className="col-12">
                <Controller name="lastName" control={control} rules={{ required: 'Last name is required', maxLength: {value:100, message: 'Max length is 100' }}} 
                    render={({ field, fieldState }) => 
                        <InputText id={field.name} {...field} placeholder="Last Name" size={50}/>} 
                />
                </div>
                <div className="col-12"><span className='p-error'>{errors.lastName?.message} </span></div>
                <div className="col-12">
                <Controller name="tuitionCentre" control={control} rules={{required: 'Tution Center is required', maxLength: {value:100, message: 'Max length is 100'} }} 
                    render={({ field, fieldState }) => 
                        <InputText id={field.name} {...field} placeholder="Tution Center"  size={50} />} 
                />
                </div>
                <div className="col-12"><span className='p-error'>{errors.tuitionCentre?.message} </span></div>
                <div className="col-12">
                <Controller name="educationLevel" control={control} rules={{ required: 'Education Level is required', maxLength: {value:20, message: 'Max length is 20'} }} 
                    render={({ field, fieldState }) => 
                        <InputText id={field.name} {...field} placeholder="Education Level" size={20} />} 
                />
                </div>
                <div className="col-12"><span className='p-error'>{errors.educationLevel?.message} </span></div>
                <Button type="submit" label="Save" className="mt-2" disabled={!isDirty} />
            </form> 
        </div>
    )
}

export default EditProfile;