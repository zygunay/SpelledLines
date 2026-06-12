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
        title: 'Edit a  Product',
        href: '/products/edit',
    },
];
interface Product{
    id:number;
    name:string;
    price:number;
    description:string;
}
interface Props{
    product:Product
}
export default function Edit({product}:Props) {

    const {data, setData, put, processing,errors}=useForm({
        name:product.name,
        price:product.price,
        description:product.description
    })
    const handleUpdate=(e:React.FormEvent)=>{
        e.preventDefault();
        put(route('products.update',product.id))
        console.log(data)
    }
    return (
        <AppLayout breadcrumbs={[{title:'Edit a product',href:'/products/${product.id}/edit'}]}>
            <Head title="Edit a product" />
            <div className='w-8/12 p-4'>
            <form onSubmit={handleUpdate} className='space-y-4'>
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
                <Button type='submit'>Edit Product</Button>
            </form>
            </div>
        </AppLayout>
    );
}
