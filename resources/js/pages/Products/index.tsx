import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];
interface PageProps {
    flash: {
        message?: string;
    };
    products: Product[];
}
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

export default function Index() {
    const { products, flash } = usePage().props as unknown as PageProps;
    const { processing, delete:destroy } = useForm();

    const handleDelete=(id: number, name: string)=>{
        if(confirm(`Do you want to delete this product? - ID:${id}. ${name}`)){
            destroy(route('products.destroy',id))}
        
        }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="m-4">
                <Link href={route('products.create')}>
                    <Button>Create a Product</Button>{' '}
                </Link>
            </div>
            <div className="m-4">
                <div>
                    {flash.message && (
                        <Alert>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {products.length > 0 && (
                <div className="w-8/12 p-4">
                <Table>
                    <TableCaption>A list of your recent Products.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                             <TableHead>Description</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell className="text-center">
                            <Link href={route('products.edit',product.id)}><Button  className='bg-blue-500 hover:bg-blue-700'>Edit</Button> </Link>
                                <Button disabled={processing}onClick={()=> handleDelete(product.id, product.name)} className='bg-red-500 hover:bg-red-700'>Delete</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            )}
        </AppLayout>
    );
}
