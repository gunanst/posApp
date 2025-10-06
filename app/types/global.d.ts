//Untuk menghindari error torch di TypeScript:
// types/global.d.ts
export { };

declare global {
    interface MediaTrackCapabilities {
        torch?: boolean;
    }

    interface MediaTrackConstraintSet {
        torch?: boolean;
    }

    interface MediaTrackConstraints {
        torch?: boolean | ConstrainBoolean;
    }
}
