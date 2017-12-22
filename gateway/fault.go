package gateway

import "github.com/pkg/errors"

// Fault handler which accepts an on-erro routine to be called,
// after its done catching the panic.
func FaultHandler(onErr func(err error)) {
	err := recover()
	if err == nil {
		return
	}

	var rerr error

	switch t := err.(type) {
	case string:
		rerr = errors.New(t)
	case interface{}:
		if _err, ok := err.(error); ok == true {
			rerr = _err
		}
	}

	if rerr == nil {
		rerr = errors.Errorf("%+v", err)
	}

	onErr(errors.Wrap(rerr, "Handler crashed"))
}
