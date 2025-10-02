import prisma from "@/lib/prisma"; // contoh import prisma client

export async function getTransactionHistory() {
    const transactions = await prisma.transaction.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    return transactions;
}
