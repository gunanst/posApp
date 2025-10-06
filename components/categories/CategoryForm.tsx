"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryFormProps } from "@/types/type";


export default function CategoryForm({ defaultValues }: CategoryFormProps) {
    return (
        <>
            <div>
                <Label htmlFor="nama">Nama</Label>
                <Input
                    id="nama"
                    name="nama"
                    required
                    defaultValue={defaultValues?.nama || ""}
                />
            </div>

        </>
    );
}
