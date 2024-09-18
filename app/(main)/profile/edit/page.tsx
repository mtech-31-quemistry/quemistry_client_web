'use client'

import { InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { UserService } from '../../../../service/UserService';

const EditProfile = () => {
    const {control, formState: { errors }, handleSubmit, reset} = useForm<Tutor>({ defaultValues: { firstName: '', lastName: '', educationLevel: '', tuitionCenter: '' } });

    const onSubmit = (data: Tutor) => {
        UserService.updateTutorProfile(data);
        console.log(data);
    }
    return (
        <div className="grid">
            <h5 className='col-12'>Profile</h5>
            <form onSubmit={handleSubmit(onSubmit)} className='col-12'>
                <div className="col-12">
                <Controller name="firstName" control={control} rules={{ required: 'First name is required', maxLength: 100 }} 
                    render={({ field, fieldState }) => 
                        <InputText  id={field.name} {...field} autoFocus placeholder="First Name" size={50} />} 
                />
                </div>
                <div className="col-12"><span className='p-error'>{errors.firstName?.message} </span></div>
                <div className="col-12">
                <Controller name="lastName" control={control} rules={{ required: 'Last name is required', maxLength: 100 }} 
                    render={({ field, fieldState }) => 
                        <InputText id={field.name} {...field} placeholder="Last Name" size={50}/>} 
                />
                </div>
                <div className="col-12"><span className='p-error'>{errors.lastName?.message} </span></div>
                <div className="col-12">
                <Controller name="tuitionCenter" control={control} rules={{ maxLength: 100 }} 
                    render={({ field, fieldState }) => 
                        <InputText id={field.name} {...field} placeholder="Tution Center" size={50} />} 
                />
                </div>
                <div className="col-12"><span className='p-error'>{errors.tuitionCenter?.message} </span></div>
                <div className="col-12">
                <Controller name="educationLevel" control={control} rules={{ required: 'Education Level is required', maxLength: 100 }} 
                    render={({ field, fieldState }) => 
                        <InputText id={field.name} {...field} placeholder="Education Level" size={50} />} 
                />
                </div>
                <div className="col-12"><span className='p-error'>{errors.educationLevel?.message} </span></div>
                <Button type="submit" label="Save" className="mt-2" />
            </form> 
        </div>
    )
}

export default EditProfile;