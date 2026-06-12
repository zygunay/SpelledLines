import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import React from 'react';
import { Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import { InfoIcon, Terminal } from 'lucide-react';
import { BadgeAlert } from 'lucide-react';
import { Siren } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a New Product',
        href: '/products/create',
    },
];

export default function Index() {

    const {data, setData, post, processing,errors}=useForm({
        name:'',
        price:'',
        description:''
    })
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();

        console.log(data)
        post(route('products.store'))
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a new product" />
            <div className='w-8/12 p-4'>
            <form onSubmit={handleSubmit} className='space-y-4'>
            {Object.keys(errors).length>0&&(
                <Alert>
                    <Siren className='h-4 w-4'/>
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        <ul>
                            {Object.entries(errors).map(([key,message])=>(
                                <li key={key}>{message as string }
                            </li>
                           
                        ))}   
                     </ul>
                </AlertDescription>
                </Alert>
                )}
                <div className="gap-5">
                    <Label htmlFor="Product Name" >Name</Label>
                    <Input placeholder='Name' value={data.name} onChange={(e)=>setData('name',e.target.value)}></Input>
                </div>

                <div className="gap-5">
                    <Label htmlFor="Product Price" >Price</Label>
                    <Input placeholder='Price' value={data.price} onChange={(e)=>setData('price',e.target.value)}></Input>
                </div>
                
                <div className="gap-5">
                    <Label htmlFor="Product description" >Description</Label>
                <Textarea placeholder='Description' value={data.description} onChange={(e)=>setData('description',e.target.value)}> </Textarea>             
                </div>
                <Button type='submit'>Add Product</Button>
            </form>
            </div>
        </AppLayout>
    );
}
